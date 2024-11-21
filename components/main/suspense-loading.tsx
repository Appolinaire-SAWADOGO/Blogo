"use client";

import { Loader2 } from "lucide-react";

const SuspenseLoading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center text-center">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
};

export default SuspenseLoading;
