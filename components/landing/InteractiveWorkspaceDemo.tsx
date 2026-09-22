"use client";

import {
  Download,
  Edit2,
  FileText,
  Film,
  FolderArchive,
  ImageIcon,
  Info,
  MoreVertical,
  Share2,
  Trash2,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
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
    name: "Screenshot (19).png",
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
    name: "Screenshot.png",
    type: "image",
    extension: "png",
    size: "250.3 KB",
    bytes: 256307,
    date: "9:59am, 22 Sep",
    url: "/assets/icons/file-image.svg",
    thumbnailBg: "bg-slate-900",
  },
];

export function InteractiveWorkspaceDemo() {
  const [activeNav, setActiveNav] = useState<"dashboard" | "documents" | "images" | "media" | "others">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<MockFile[]>(INITIAL_FILES);
  const [activeDropdownFileId, setActiveDropdownFileId] = useState<string | null>(null);
  const [selectedModalFile, setSelectedModalFile] = useState<MockFile | null>(null);
  const [modalType, setModalType] = useState<"details" | "share" | "rename" | "upload" | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: "/assets/icons/dashboard.svg" },
    { id: "documents", name: "Documents", icon: "/assets/icons/documents.svg" },
    { id: "images", name: "Images", icon: "/assets/icons/images.svg" },
    { id: "media", name: "Media", icon: "/assets/icons/video.svg" },
    { id: "others", name: "Others", icon: "/assets/icons/others.svg" },
  ];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeNav === "dashboard") return matchesSearch;
    if (activeNav === "documents") return matchesSearch && f.type === "document";
    if (activeNav === "images") return matchesSearch && f.type === "image";
    if (activeNav === "media") return matchesSearch && f.type === "video";
    if (activeNav === "others") return matchesSearch && f.type === "other";
    return matchesSearch;
  });

  const handleAction = (file: MockFile, action: "details" | "share" | "rename" | "download" | "delete") => {
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

  return (
    <section id="interactive-demo" className="py-16 md:py-24 bg-[#F8FAFC] border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark-200 tracking-tight font-poppins">
            Experience the real Cloudence dashboard.
          </h2>
          <p className="mt-3 text-base text-light-100 max-w-2xl mx-auto">
            Try the actual Cloudence interface live below: switch between Dashboard, Documents, and Images, test real-time search, inspect file properties, and simulate uploads.
          </p>
        </div>

        {/* Browser Mockup Frame */}
        <div className="rounded-[24px] border border-slate-300/80 bg-white shadow-2xl overflow-hidden">
          {/* Browser Navigation Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-[#EBF0F5] text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block border border-[#E0443E]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block border border-[#DEA123]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block border border-[#1AAB29]" />
            </div>

            {/* URL bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="bg-white rounded-full px-4 py-1.5 border border-slate-300 flex items-center justify-between text-xs text-slate-700 shadow-inner">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-600 font-bold">🔒</span>
                  <span className="font-mono text-slate-800 font-medium">https://cloudence.chefu.co.za/dashboard</span>
                </div>
                <span className="text-[10px] font-mono text-brand font-semibold px-2 py-0.5 rounded bg-brand/10">
                  LIVE DEMO
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span>99.98% Uptime</span>
            </div>
          </div>

          {/* REAL CLOUDENCE APP SHELL */}
          <div className="bg-white p-4 sm:p-6 lg:p-8 flex min-h-[740px]">
            {/* Left Sidebar */}
            <aside className="hidden md:flex w-[210px] lg:w-[240px] flex-col justify-between pr-4 lg:pr-6 border-r border-slate-100 shrink-0">
              <div>
                {/* Logo & Brand */}
                <div className="flex items-center gap-2.5 px-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    C
                  </div>
                  <span className="text-lg font-bold text-dark-200 font-poppins">Cloudence</span>
                </div>

                {/* Sidebar Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveNav(item.id as any);
                          setActiveDropdownFileId(null);
                        }}
                        className={`flex items-center gap-3.5 w-full px-5 py-3 rounded-full text-sm font-semibold transition-all text-left ${
                          isActive
                            ? "bg-brand text-white shadow-drop-2"
                            : "text-light-100 hover:bg-slate-100/80 hover:text-dark-200"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className={isActive ? "invert-0 opacity-100 brightness-200" : "opacity-40"}
                        />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Middle 3D Files Folder Card & User Pill */}
              <div className="space-y-4 pt-4">
                {/* 3D files-2.png pink card */}
                <div className="rounded-[22px] bg-[#FFF0F2] p-3 flex items-center justify-center">
                  <Image
                    src="/assets/images/files-2.png"
                    alt="Storage files"
                    width={180}
                    height={150}
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* User Info Pill */}
                <div className="flex items-center gap-2.5 rounded-full bg-brand/10 p-2 text-light-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-brand/20 shrink-0 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs">
                    KM
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-bold text-dark-200 truncate font-poppins">John Doe</p>
                    <p className="text-[10px] text-light-200 truncate">johndoe@email.com</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Content Area */}
            <main className="flex-1 flex flex-col md:pl-6 min-w-0">
              {/* Header */}
              <header className="flex items-center justify-between gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-[480px]">
                  <div className="flex items-center h-[52px] rounded-full bg-white px-5 shadow-drop-3 border border-slate-100">
                    <Image
                      src="/assets/icons/search.svg"
                      alt="Search"
                      width={18}
                      height={18}
                      className="opacity-40 mr-3"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-dark-200 placeholder:text-light-200 focus:outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-light-200 hover:text-dark-200">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModalType("upload")}
                    className="primary-btn h-[44px] rounded-full px-6 flex items-center gap-2 bg-brand text-white shadow-drop-1 hover:bg-brand-100 transition-all"
                  >
                    <Image
                      src="/assets/icons/upload.svg"
                      alt="Upload"
                      width={20}
                      height={20}
                      className="brightness-200"
                    />
                    <span className="text-sm font-semibold hidden sm:inline">Upload</span>
                  </button>

                  <button
                    onClick={() => showToast("Simulated sign-out action")}
                    className="w-[44px] h-[44px] rounded-full bg-brand/10 hover:bg-brand/20 flex items-center justify-center text-brand transition-colors"
                    title="Log out"
                  >
                    <Image
                      src="/assets/icons/logout.svg"
                      alt="Log out"
                      width={22}
                      height={22}
                    />
                  </button>
                </div>
              </header>

              {/* Toast Notification */}
              {toastMessage && (
                <div className="mb-4 px-4 py-2.5 bg-brand text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
                  <span>{toastMessage}</span>
                  <button onClick={() => setToastMessage(null)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Content Panel (Gray rounded shell matching real app) */}
              <div className="flex-1 bg-light-400 rounded-[24px] p-4 sm:p-6 overflow-y-auto">
                {activeNav === "dashboard" ? (
                  /* ================= DASHBOARD VIEW (From Screenshot) ================= */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
                    {/* Left Column: Chart Card + 2x2 Summary Cards */}
                    <div className="lg:col-span-7 flex flex-col gap-5">
                      {/* Radial Chart Card */}
                      <div className="flex flex-col sm:flex-row items-center rounded-[20px] bg-brand p-6 text-white shadow-sm">
                        {/* Donut Progress Meter */}
                        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background Track */}
                            <circle
                              cx="60"
                              cy="60"
                              r="46"
                              stroke="rgba(255, 255, 255, 0.2)"
                              strokeWidth="12"
                              fill="none"
                            />
                            {/* Value Arc (.03%) */}
                            <circle
                              cx="60"
                              cy="60"
                              r="46"
                              stroke="#ffffff"
                              strokeWidth="12"
                              strokeDasharray={289}
                              strokeDashoffset={289 - (289 * 0.03) / 100}
                              strokeLinecap="round"
                              fill="none"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-extrabold text-white tracking-tight">.03%</span>
                            <span className="text-xs text-white/80 font-normal">Space used</span>
                          </div>
                        </div>

                        {/* Text Details */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                          <h3 className="text-lg font-bold text-white font-poppins">Available Storage</h3>
                          <p className="text-sm text-white/80 mt-1 font-medium">598.5 KB / 2GB</p>
                        </div>
                      </div>

                      {/* 2x2 Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Documents */}
                        <div
                          onClick={() => setActiveNav("documents")}
                          className="relative rounded-[18px] bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5B5B] flex items-center justify-center text-white shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-dark-200">
                              {files.filter((f) => f.type === "document").length > 0 ? "1.2 MB" : "0 Bytes"}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-dark-200 text-center mb-3">Documents</h4>
                          <div className="h-[1px] bg-light-400 w-full mb-2" />
                          <p className="text-xs text-light-200 text-center">
                            {files.filter((f) => f.type === "document").length > 0 ? "Just now" : "-"}
                          </p>
                        </div>

                        {/* Images */}
                        <div
                          onClick={() => setActiveNav("images")}
                          className="relative rounded-[18px] bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#38B6FF] flex items-center justify-center text-white shadow-sm">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-dark-200">598.5 KB</span>
                          </div>
                          <h4 className="text-sm font-semibold text-dark-200 text-center mb-3">Images</h4>
                          <div className="h-[1px] bg-light-400 w-full mb-2" />
                          <p className="text-xs text-light-200 text-center">11:22am, 22 Sep</p>
                        </div>

                        {/* Media */}
                        <div
                          onClick={() => setActiveNav("media")}
                          className="relative rounded-[18px] bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#3DD9B3] flex items-center justify-center text-white shadow-sm">
                              <Film className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-dark-200">0 Bytes</span>
                          </div>
                          <h4 className="text-sm font-semibold text-dark-200 text-center mb-3">Media</h4>
                          <div className="h-[1px] bg-light-400 w-full mb-2" />
                          <p className="text-xs text-light-200 text-center">-</p>
                        </div>

                        {/* Others */}
                        <div
                          onClick={() => setActiveNav("others")}
                          className="relative rounded-[18px] bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#EEA8FD] flex items-center justify-center text-white shadow-sm">
                              <FolderArchive className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-dark-200">0 Bytes</span>
                          </div>
                          <h4 className="text-sm font-semibold text-dark-200 text-center mb-3">Others</h4>
                          <div className="h-[1px] bg-light-400 w-full mb-2" />
                          <p className="text-xs text-light-200 text-center">-</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Recent Files Uploaded */}
                    <div className="lg:col-span-5">
                      <div className="bg-white rounded-[20px] p-6 shadow-sm h-full flex flex-col">
                        <h3 className="text-lg font-bold text-dark-200 mb-5 font-poppins">Recent files uploaded</h3>

                        {filteredFiles.length === 0 ? (
                          <div className="text-center py-12 text-light-200 text-sm">
                            <p>No files uploaded</p>
                          </div>
                        ) : (
                          <div className="space-y-4 flex-1">
                            {filteredFiles.map((file) => (
                              <div
                                key={file.id}
                                className="relative flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                  {/* Circular thumbnail */}
                                  <div className="w-12 h-12 rounded-full bg-brand/10 overflow-hidden flex items-center justify-center shrink-0">
                                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-[10px]">
                                      {file.extension.toUpperCase()}
                                    </div>
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-dark-200 truncate">{file.name}</p>
                                    <p className="text-xs text-light-200">{file.date}</p>
                                  </div>
                                </div>

                                {/* Action button */}
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setActiveDropdownFileId(
                                        activeDropdownFileId === file.id ? null : file.id
                                      )
                                    }
                                    className="p-1.5 text-light-200 hover:text-dark-200 rounded-full hover:bg-slate-100"
                                    title="File Actions"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {/* Action Dropdown Menu */}
                                  {activeDropdownFileId === file.id && (
                                    <div className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-white shadow-drop-3 border border-slate-100 py-1.5 text-xs text-light-100">
                                      <button
                                        onClick={() => handleAction(file, "rename")}
                                        className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-slate-50 hover:text-dark-200 text-left"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>Rename</span>
                                      </button>
                                      <button
                                        onClick={() => handleAction(file, "details")}
                                        className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-slate-50 hover:text-dark-200 text-left"
                                      >
                                        <Info className="w-3.5 h-3.5" />
                                        <span>Details</span>
                                      </button>
                                      <button
                                        onClick={() => handleAction(file, "share")}
                                        className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-slate-50 hover:text-dark-200 text-left"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                      </button>
                                      <button
                                        onClick={() => handleAction(file, "download")}
                                        className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-slate-50 hover:text-dark-200 text-left"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download</span>
                                      </button>
                                      <div className="my-1 border-t border-slate-100" />
                                      <button
                                        onClick={() => handleAction(file, "delete")}
                                        className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-red-50 text-red-600 text-left"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= TYPE LIST VIEW (e.g. Images, Documents) ================= */
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-dark-200 capitalize font-poppins">{activeNav}</h2>
                        <p className="text-sm text-light-100 mt-1">
                          Total:{" "}
                          <span className="font-semibold text-dark-200">
                            {activeNav === "images"
                              ? "598.5 KB"
                              : activeNav === "documents" && files.some((f) => f.type === "document")
                              ? "1.2 MB"
                              : "0 Bytes"}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveNav("dashboard")}
                        className="text-xs font-semibold text-brand hover:underline self-start sm:self-auto"
                      >
                        ← Back to Dashboard
                      </button>
                    </div>

                    {filteredFiles.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFiles.map((file) => (
                          <div
                            key={file.id}
                            className="bg-white rounded-[16px] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
                                <span className="font-bold text-brand font-mono text-sm uppercase">
                                  {file.extension}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <button
                                  onClick={() =>
                                    setActiveDropdownFileId(activeDropdownFileId === file.id ? null : file.id)
                                  }
                                  className="p-1 text-light-200 hover:text-dark-200"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-medium text-light-100">{file.size}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-dark-200 truncate">{file.name}</p>
                              <p className="text-xs text-light-200 mt-1">{file.date}</p>
                              <p className="text-[11px] text-light-200 mt-1">By: John Doe</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-white rounded-[20px]">
                        <p className="text-sm text-light-200">No files uploaded in {activeNav}</p>
                        <button
                          onClick={handleSimulatedUpload}
                          className="mt-3 text-xs font-semibold text-brand hover:underline"
                        >
                          + Upload sample file to {activeNav}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* ================= MODALS ================= */}

        {/* Details Modal */}
        {modalType === "details" && selectedModalFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setModalType(null)}
                className="absolute top-5 right-5 text-light-200 hover:text-dark-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-dark-200 font-poppins mb-4">File Details</h3>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-light-400 rounded-xl flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center font-bold text-brand text-xs">
                    {selectedModalFile.extension.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-dark-200 truncate">{selectedModalFile.name}</p>
                    <p className="text-xs text-light-200">{selectedModalFile.size}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-light-100">Format:</span>
                    <span className="font-medium text-dark-200">{selectedModalFile.extension.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-light-100">Size:</span>
                    <span className="font-medium text-dark-200">{selectedModalFile.size}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-light-100">Owner:</span>
                    <span className="font-medium text-dark-200">John Doe</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-light-100">Last modified:</span>
                    <span className="font-medium text-dark-200">{selectedModalFile.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-2.5 rounded-full bg-brand text-white font-semibold text-xs hover:bg-brand-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {modalType === "share" && selectedModalFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setModalType(null)}
                className="absolute top-5 right-5 text-light-200 hover:text-dark-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-dark-200 font-poppins mb-2">Share File</h3>
              <p className="text-xs text-light-100 mb-4">
                Share <strong className="text-dark-200">{selectedModalFile.name}</strong> with colleagues or external collaborators.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-light-100 mb-1.5">Direct Share URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://cloudence.chefu.co.za/f/${selectedModalFile.id}`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-light-400 border border-slate-200 text-xs font-mono text-dark-200 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-100 transition-colors shrink-0"
                    >
                      {copiedLink ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-light-100 mb-1.5">Invite by email</label>
                  <input
                    type="email"
                    placeholder="colleague@chefu.co.za"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-dark-200 placeholder:text-light-200 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-light-100 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setModalType(null);
                    showToast("Invite sent successfully.");
                  }}
                  className="flex-1 py-2.5 rounded-full bg-brand text-white font-semibold text-xs hover:bg-brand-100 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {modalType === "rename" && selectedModalFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setModalType(null)}
                className="absolute top-5 right-5 text-light-200 hover:text-dark-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-dark-200 font-poppins mb-4">Rename File</h3>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-light-100 mb-1.5">New Name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-dark-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-light-100 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setFiles((prev) =>
                      prev.map((f) => (f.id === selectedModalFile.id ? { ...f, name: renameValue } : f))
                    );
                    setModalType(null);
                    showToast(`Renamed to "${renameValue}"`);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-brand text-white font-semibold text-xs hover:bg-brand-100 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {modalType === "upload" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setModalType(null)}
                className="absolute top-5 right-5 text-light-200 hover:text-dark-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-dark-200 font-poppins mb-2">Upload to Cloudence</h3>
              <p className="text-xs text-light-100 mb-5">
                Direct uploads up to 50MB per file with automatic format categorization.
              </p>

              <div
                onClick={handleSimulatedUpload}
                className="border-2 border-dashed border-slate-200 hover:border-brand rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-brand/5"
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-dark-200">Click to upload sample file</p>
                <p className="text-xs text-light-200 mt-1">Supports PDF, DOCX, PNG, JPG, MP4, ZIP</p>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setModalType(null)}
                  className="text-xs font-semibold text-light-200 hover:text-dark-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
