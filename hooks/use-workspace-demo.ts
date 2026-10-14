"use client";
import { useState } from "react";
interface MockFile {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "other";
  extension: string;
  size: string;
  bytes: number;
  date: string;
  url: string;
  thumbnailBg?: string;
}

const INITIAL_FILES: MockFile[] = [
  {
    id: "img-1",
    name: "Budget Overview.png",
    type: "image",
    extension: "png",
    size: "348.2 KB",
    bytes: 356556,
    date: "9:59am, 22 Sep",
    url: "/assets/icons/file-image.svg",
    thumbnailBg: "bg-slate-800",
  },
  {
    id: "img-2",
    name: "Client Presentation.png",
    type: "image",
    extension: "png",
    size: "250.3 KB",
    bytes: 256307,
    date: "9:59am, 22 Sep",
    url: "/assets/icons/file-image.svg",
    thumbnailBg: "bg-slate-900",
  },
];

type DemoNavTab = "dashboard" | "documents" | "images" | "media" | "others";

export function useWorkspaceDemo() {
  const [activeNav, setActiveNav] = useState<DemoNavTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<MockFile[]>(INITIAL_FILES);
  const [activeDropdownFileId, setActiveDropdownFileId] = useState<
    string | null
  >(null);
  const [selectedModalFile, setSelectedModalFile] = useState<MockFile | null>(
    null,
  );
  const [modalType, setModalType] = useState<
    "details" | "share" | "rename" | "upload" | null
  >(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navItems: Array<{ id: DemoNavTab; name: string; icon: string }> = [
    { id: "dashboard", name: "Dashboard", icon: "/assets/icons/dashboard.svg" },
    { id: "documents", name: "Documents", icon: "/assets/icons/documents.svg" },
    { id: "images", name: "Images", icon: "/assets/icons/images.svg" },
    { id: "media", name: "Media", icon: "/assets/icons/video.svg" },
    { id: "others", name: "Others", icon: "/assets/icons/others.svg" },
  ];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeNav === "dashboard") return matchesSearch;
    if (activeNav === "documents")
      return matchesSearch && f.type === "document";
    if (activeNav === "images") return matchesSearch && f.type === "image";
    if (activeNav === "media") return matchesSearch && f.type === "video";
    if (activeNav === "others") return matchesSearch && f.type === "other";
    return matchesSearch;
  });

  const handleAction = (
    file: MockFile,
    action: "details" | "share" | "rename" | "download" | "delete",
  ) => {
    setActiveDropdownFileId(null);
    if (action === "details") {
      setSelectedModalFile(file);
      setModalType("details");
    } else if (action === "share") {
      setSelectedModalFile(file);
      setModalType("share");
    } else if (action === "rename") {
      setSelectedModalFile(file);
      setRenameValue(file.name);
      setModalType("rename");
    } else if (action === "download") {
      showToast(`Downloading "${file.name}"...`);
    } else if (action === "delete") {
      setFiles((prev) => prev.filter((item) => item.id !== file.id));
      showToast(`Deleted "${file.name}"`);
    }
  };

  const handleSimulatedUpload = () => {
    const newDoc: MockFile = {
      id: `doc-${Date.now()}`,
      name: "Project_Proposal_Q4.pdf",
      type: "document",
      extension: "pdf",
      size: "1.2 MB",
      bytes: 1258291,
      date: "Just now",
      url: "/assets/icons/file-pdf.svg",
      thumbnailBg: "bg-emerald-700",
    };
    setFiles((prev) => [newDoc, ...prev]);
    setModalType(null);
    showToast(`Uploaded "${newDoc.name}" (+1.2 MB)`);
  };

  return {
    activeNav,
    setActiveNav,
    searchQuery,
    setSearchQuery,
    activeDropdownFileId,
    setActiveDropdownFileId,
    selectedModalFile,
    setSelectedModalFile,
    modalType,
    setModalType,
    renameValue,
    setRenameValue,
    copiedLink,
    setCopiedLink,
    toastMessage,
    files,
    setToastMessage,
    navItems,
    filteredFiles,
    handleAction,
    handleSimulatedUpload,
    setFiles,
    showToast,
  };
}
