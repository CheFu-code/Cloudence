import Image from "next/image";
import { avatarPlaceholderUrl } from "@/constants";
import { BrandLogo } from "@/components/landing/BrandLogo";
import { MobileMenuShell } from "./MobileMenuShell";
import { WorkspaceNav } from "./WorkspaceNav";
import FileUploader from "./FileUploader";
import { LogoutButton } from "./LogoutButton";
interface Props {
  fullName: string;
  avatar: string;
  email: string;
}
export default function MobileNavigation({ fullName, avatar, email }: Props) {
  return (
    <header className="mobile-header">
      <BrandLogo href="/dashboard" className="text-light-100" />
      <MobileMenuShell
        title={
          <>
            <div className="header-user">
              <Image
                src={avatar || avatarPlaceholderUrl}
                alt="Avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div>
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <hr className="mb-4 border-light-200/20" />
          </>
        }
      >
        <WorkspaceNav mobile />
        <hr className="my-5 border-light-200/20" />
        <div className="flex flex-col justify-between gap-5 pb-5">
          <FileUploader />
          <LogoutButton mobile />
        </div>
      </MobileMenuShell>
    </header>
  );
}
