import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/main/header";
import { SubscribeModal } from "@/components/main/modals/subscribe";
import ReactQueryDevtoolsProvider from "@/components/providers/react-query-devtools";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Blogo",
  description:
    "Discover the ultimate student blog for tech, manga, and video game enthusiasts! Find reviews, guides, and the latest news on cutting-edge technology, popular manga series, and must-play video games. Whether you're a student or just curious, dive into a world where geek culture meets the latest tech trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`antialiased`}>
          <ReactQueryDevtoolsProvider>
            <div className="lg:max-w-5xl m-auto relative">
              <Toaster />
              <SubscribeModal />
              <Header />
              {children}
            </div>
          </ReactQueryDevtoolsProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
