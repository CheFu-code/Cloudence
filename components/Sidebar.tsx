import { WorkspaceNav } from "./WorkspaceNav";
import Image from "next/image";
import { avatarPlaceholderUrl } from "@/constants";
import { BrandLogo } from "@/components/landing/BrandLogo";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  return (
    <aside className="sidebar">
      <BrandLogo className="text-light-100" />

      <WorkspaceNav />

      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
        priority
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar || avatarPlaceholderUrl}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block min-w-0">
          <p className="subtitle-2 capitalize truncate">{fullName}</p>
          <p className="caption truncate">{email}</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
