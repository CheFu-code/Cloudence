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

import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import { useFileActions } from "@/hooks/use-file-actions";
import { localDateTime } from "@/lib/file-input";

const ActionDropdown = ({ file, folders, initialOpen = false }: { file: CloudenceFile; folders?: CloudenceFolder[]; initialOpen?: boolean }) => {
  const {
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
    folderId,
    setFolderId,
    closeAllModals,
    handleAction,
    handleRemoveUser,
    handleDownload,
  } = useFileActions(file, initialOpen);

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
          {value === "move" && (
            <label className="flex flex-col gap-2 text-sm">
              Destination
              <select className="rounded-md border p-3" value={folderId} onChange={(event) => setFolderId(event.target.value)} disabled={isLoading}>
                <option value="">Section root</option>
                {folders?.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
              </select>
            </label>
          )}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
              disabled={isLoading}
              emailError={emailError}
              expiry={expiry}
              onExpiryChange={setExpiry}
              expiryError={expiryError}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share", "move"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              disabled={isLoading}
              onClick={closeAllModals}
              className="modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              disabled={
                isLoading ||
                (value === "share" && !canShare) ||
                (value === "rename" && !name.trim())
              }
              onClick={handleAction}
              className={
                value === "delete"
                  ? "modal-delete-button"
                  : "modal-submit-button"
              }
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
      <DropdownMenu modal={false} open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger disabled={isLoading} className="shad-no-focus" aria-label={`Actions for ${file.name}`}>
          <Image
            src="/assets/icons/dots.svg"
            alt=""
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[...actionsDropdownItems, ...(folders ? [{ value: "move", label: "Move to folder", icon: "/assets/icons/file-other.svg" }] : [])]
            .filter(
              (item) =>
                file.isOwner || ["details", "download", "move"].includes(item.value),
            )
            .map((actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className="shad-dropdown-item"
                onClick={() => {
                  setAction(actionItem);
                  if (actionItem.value === "move") setFolderId(file.folderId || "");
                  if (actionItem.value === "share") {
                    setEmails([]);
                    setExpiry(localDateTime(file.shareExpiresAt));
                  }

                  if (
                    ["rename", "share", "delete", "details", "move"].includes(
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
