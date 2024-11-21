import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href={"/"} className={cn("text-4xl font-extrabold z-10", className)}>
      Blogo.
    </Link>
  );
};

export default Logo;
