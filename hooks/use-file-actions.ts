"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  deleteFile,
  getFileDownloadUrl,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import {
  invalidEmails,
  localDateTime,
  normalizeEmails,
} from "@/lib/file-input";

export function useFileActions(file: CloudenceFile, initialOpen = false) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(initialOpen);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [expiry, setExpiry] = useState(localDateTime(file.shareExpiresAt));
  const invalid = invalidEmails(emails);
  const emailError = invalid.length
    ? `Check these email addresses: ${invalid.join(", ")}`
    : "";
  const expiryError =
    expiry &&
    (!Number.isFinite(Date.parse(expiry)) || Date.parse(expiry) <= Date.now())
      ? "Choose a future date and time, or clear it for no expiration."
      : "";
  const hasShareChanges =
    normalizeEmails(emails).length > 0 ||
    expiry !== localDateTime(file.shareExpiresAt);
  const canShare = !emailError && !expiryError && hasShareChanges;
  const { toast } = useToast();

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
    setExpiry(localDateTime(file.shareExpiresAt));
  };

  const handleAction = async () => {
    if (
      !action ||
      isLoading ||
      !file.isOwner ||
      (action.value === "share" && !canShare)
    )
      return;
    setIsLoading(true);

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () =>
        updateFileUsers({
          fileId: file.$id,
          addEmails: normalizeEmails(emails).length
            ? normalizeEmails(emails)
            : undefined,
          path,
          shareExpiresAt:
            expiry === localDateTime(file.shareExpiresAt)
              ? undefined
              : expiry
                ? new Date(expiry).toISOString()
                : "",
        }),
      delete: () => deleteFile({ fileId: file.$id, path }),
    };

    try {
      const result = await actions[action.value as keyof typeof actions]();

      // Server actions return { error } instead of throwing so the message
      // survives Next.js production serialisation.
      if (result && "error" in result && result.error) {
        toast({
          title: `${action.label} failed`,
          description: String(result.error),
          className: "error-toast",
        });
        return;
      }

      if (result) {
        toast({
          title: `${action.label} complete`,
          description: `${file.name} was updated successfully.`,
        });
        closeAllModals();
      }
    } catch (error) {
      toast({
        title: `${action.label} failed`,
        description:
          error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (isLoading || !file.isOwner) return;
    setIsLoading(true);

    try {
      const result = await updateFileUsers({
        fileId: file.$id,
        removeEmails: [email],
        path,
      });

      if (result && "error" in result && result.error) {
        toast({
          title: "Share update failed",
          description: String(result.error),
          className: "error-toast",
        });
        return;
      }

      toast({
        title: "Share settings updated",
        description: `${email} was removed.`,
      });
      closeAllModals();
    } catch (error) {
      toast({
        title: "Share update failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);

    try {
      const res = await getFileDownloadUrl(file.$id);
      if (res && "error" in res && res.error) {
        toast({
          title: "Download failed",
          description: String(res.error),
          className: "error-toast",
        });
        return;
      }
      if (res && "downloadUrl" in res && res.downloadUrl) {
        const a = document.createElement("a");
        a.href = res.downloadUrl;
        a.download = file.name;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast({
          title: "Download started",
          description: `Downloading ${file.name}...`,
        });
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not download file. Please try again.",
        className: "error-toast",
      });
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    action,
    setAction,
    name,
    setName,
    isLoading,
    emails,
    setEmails,
    expiry,
    setExpiry,
    emailError,
    expiryError,
    canShare,
    closeAllModals,
    handleAction,
    handleRemoveUser,
    handleDownload,
  };
}
