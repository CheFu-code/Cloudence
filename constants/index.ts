import { FileText, Film, Image as ImageIcon, Package } from "lucide-react";


export const navItems = [
    {
        name: "Dashboard",
        icon: "/assets/icons/dashboard.svg",
        url: "/dashboard",
    },
    {
        name: "Documents",
        icon: "/assets/icons/documents.svg",
        url: "/documents",
    },
    {
        name: "Images",
        icon: "/assets/icons/images.svg",
        url: "/images",
    },
    {
        name: "Media",
        icon: "/assets/icons/video.svg",
        url: "/media",
    },
    {
        name: "Others",
        icon: "/assets/icons/others.svg",
        url: "/others",
    },
];

export const actionsDropdownItems = [
    {
        label: "Rename",
        icon: "/assets/icons/edit.svg",
        value: "rename",
    },
    {
        label: "Details",
        icon: "/assets/icons/info.svg",
        value: "details",
    },
    {
        label: "Share",
        icon: "/assets/icons/share.svg",
        value: "share",
    },
    {
        label: "Download",
        icon: "/assets/icons/download.svg",
        value: "download",
    },
    {
        label: "Delete",
        icon: "/assets/icons/delete.svg",
        value: "delete",
    },
];

export const sortTypes = [
    {
        label: "Date created (newest)",
        value: "$createdAt-desc",
    },
    {
        label: "Created Date (oldest)",
        value: "$createdAt-asc",
    },
    {
        label: "Name (A-Z)",
        value: "name-asc",
    },
    {
        label: "Name (Z-A)",
        value: "name-desc",
    },
    {
        label: "Size (Highest)",
        value: "size-desc",
    },
    {
        label: "Size (Lowest)",
        value: "size-asc",
    },
];

export const avatarPlaceholderUrl =
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB


export const categories = [
    {
        name: "Documents",
        icon: FileText,
        formats: "PDF, DOCX, XLSX, PPT, TXT",
        typicalSize: "1 - 15 MB",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        barColor: "bg-emerald-500",
        description: "Fast in-browser viewing and keyword indexable for quick retrieval.",
    },
    {
        name: "Images & Vectors",
        icon: ImageIcon,
        formats: "PNG, JPG, SVG, WebP, GIF",
        typicalSize: "2 - 25 MB",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        barColor: "bg-blue-500",
        description: "Lossless storage with automatic visual thumbnail generation.",
    },
    {
        name: "Video & Audio",
        icon: Film,
        formats: "MP4, WebM, MOV, MP3, WAV",
        typicalSize: "10 - 50 MB",
        color: "text-purple-600 bg-purple-50 border-purple-200",
        barColor: "bg-purple-500",
        description: "Cloudinary CDN accelerated streaming with adaptive bitrate.",
    },
    {
        name: "Archives & Others",
        icon: Package,
        formats: "ZIP, TAR, GZ, 7Z, CSV",
        typicalSize: "Up to 50 MB",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        barColor: "bg-amber-500",
        description: "Safe container storage with secure hash verification.",
    },
];


export const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Interactive Demo", href: "#interactive-demo" },
    { name: "Storage & Formats", href: "#storage" },
    { name: "Security & Cloud", href: "#security" },
    { name: "FAQ", href: "#faq" },
];