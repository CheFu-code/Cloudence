import React from "react";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";
import { LogoutButton } from "@/components/LogoutButton";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form action={signOutUser}>
          <LogoutButton />
        </form>
      </div>
    </header>
  );
};
export default Header;
