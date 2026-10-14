import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React, { useId } from "react";
import { localDateTime } from "@/lib/file-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: CloudenceFile }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p suppressHydrationWarning className="file-details-value text-left">
      {value}
    </p>
  </div>
);

export const FileDetails = ({ file }: { file: CloudenceFile }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
        <DetailRow
          label="Sharing expires:"
          value={
            file.shareExpiresAt
              ? formatDateTime(file.shareExpiresAt)
              : "No expiration"
          }
        />
      </div>
    </>
  );
};

interface Props {
  file: CloudenceFile;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
  disabled?: boolean;
  emailError?: string;
  expiry: string;
  onExpiryChange: (value: string) => void;
  expiryError?: string;
}

export const ShareInput = ({
  file,
  onInputChange,
  onRemove,
  disabled,
  emailError,
  expiry,
  onExpiryChange,
  expiryError,
}: Props) => {
  const id = useId();
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          multiple
          disabled={disabled}
          aria-label="Email addresses to share with"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? `${id}-emails-error` : undefined}
          placeholder="Enter email addresses, separated by commas"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        {emailError && (
          <p
            id={`${id}-emails-error`}
            role="alert"
            className="mt-2 text-sm text-error"
          >
            {emailError}
          </p>
        )}
        <div className="mt-4 space-y-2">
          <label htmlFor={`${id}-expiry`} className="subtitle-2 text-light-100">
            Sharing expiration (your local time)
          </label>
          <Input
            id={`${id}-expiry`}
            type="datetime-local"
            value={expiry}
            min={localDateTime(new Date().toISOString())}
            disabled={disabled}
            onChange={(event) => onExpiryChange(event.target.value)}
            aria-invalid={Boolean(expiryError)}
            aria-describedby={`${id}-expiry-help`}
          />
          <p
            id={`${id}-expiry-help`}
            role={expiryError ? "alert" : undefined}
            className={
              expiryError ? "text-sm text-error" : "text-sm text-light-200"
            }
          >
            {expiryError ||
              "Leave empty for no expiration. Applies to all shared recipients."}
          </p>
          {expiry && (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => onExpiryChange("")}
            >
              Clear expiration
            </Button>
          )}
        </div>
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove access for ${email}`}
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
