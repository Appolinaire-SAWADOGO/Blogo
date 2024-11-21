import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "w-full h-24 bg-black mt-16 pl-10 sm:pl-6 items-center justify-center text-center",
        className
      )}
    >
      <div className="w-full relative h-full flex items-center justify-between">
        <Logo className="text-white max-sm:text-3xl" />
        <Link
          href={"https://github.com/Appolinaire-SAWADOGO"}
          className="text-white opacity-60 text-sm max-sm:text-[12px] hover:underline sm:absolute sm:top-0 sm:bottom-0 sm:left-0 sm:right-0 sm:flex sm:items-center sm:justify-center sm:text-center pr-6 sm:pr-0"
        >
          @Create by appolinaire sdg
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
