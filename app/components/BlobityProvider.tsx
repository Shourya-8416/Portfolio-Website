"use client";
import { useEffect } from "react";
import useBlobity from "blobity/lib/react/useBlobity";
import { initialBlobityOptions } from "@/utils/blobity.config";

export default function BlobityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const blobity = useBlobity(initialBlobityOptions);

  useEffect(() => {
    if (blobity && typeof blobity.updateOptions === "function") {
      blobity.updateOptions(initialBlobityOptions);
    }
  }, [blobity]);

  return <>{children}</>;
}
