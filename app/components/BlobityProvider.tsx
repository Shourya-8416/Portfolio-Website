"use client";
import { useEffect } from "react";
import useBlobity from "blobity/lib/react/useBlobity";
import { initialBlobityOptions } from "@/utils/blobity.config";

export default function BlobityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const blobityRef = useBlobity(initialBlobityOptions);

  useEffect(() => {
    const blobity = blobityRef?.current;
    if (blobity && typeof blobity.updateOptions === "function") {
      blobity.updateOptions(initialBlobityOptions);
    }
  }, [blobityRef]);

  return <>{children}</>;
}
