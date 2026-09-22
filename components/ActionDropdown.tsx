"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  getFileDownloadUrl,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import { useToast } from "@/hooks/use-toast";

const ActionDropdown = ({ file }: { file: CloudenceFile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const { toast } = useToast();

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, path }),
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
        description: error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    try {
      const result = await updateFileUsers({ fileId: file.$id, emails: updatedEmails, path });

      if (result && "error" in result && result.error) {
        toast({
          title: "Share update failed",
          description: String(result.error),
          className: "error-toast",
        });
        return;
      }

      setEmails(updatedEmails);
      toast({ title: "Share settings updated", description: `${email} was removed.` });
      closeAllModals();
    } catch (error) {
      toast({
        title: "Share update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
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
        description: error instanceof Error ? error.message : "Could not download file. Please try again.",
        className: "error-toast",
      });
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          <DialogDescription className="sr-only">
            File action dialog for {file.name}
          </DialogDescription>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button disabled={isLoading} onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleAction}
              className={value === "delete" ? "modal-delete-button" : "modal-submit-button"}
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) closeAllModals();
      }}
    >
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger disabled={isLoading} className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);
                if (actionItem.value === "share") {
                  setEmails([]);
                }

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value,
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <div
                  onClick={handleDownload}
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
