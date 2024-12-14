"use client";

import { UploadButton } from "~/utils/uploadthings";
import { useRouter } from "next/navigation";
import * as React from "react";

export function UploadButtonCom() {
  const router = useRouter();

  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        alert("Upload Completed");
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}

export function LogoUploadButton() {
  const router = useRouter();
  return (
    <UploadButton
      endpoint="logoUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        alert("Upload Completed");
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}

