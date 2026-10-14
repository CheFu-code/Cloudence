import React from "react";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { LogoutButton } from "@/components/LogoutButton";

const Header = () => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <LogoutButton />
      </div>
    </header>
  );
};
export default Header;
