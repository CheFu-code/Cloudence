import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
})

export const metadata: Metadata = {
    title: "Cloudence | Chefu Technologies",
    description: "Cloudence - Beyond storage, into the clouds.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} font-poppins antialiased`}
            >
                <TooltipProvider>
                    {children}
                    <Analytics />
                </TooltipProvider>
            </body>
        </html>
    );
}
