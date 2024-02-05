"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;
  const caption = data.caption;
  return (
    <div className="relative w-full min-h-[15rem]">
      <div className="flex flex-col">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <div className="flex flex-col justify-center items-center">
            <img alt={caption} className="object-contain" src={src} />
            <h1 className="text-slate-500">{caption}</h1>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default CustomImageRenderer;
