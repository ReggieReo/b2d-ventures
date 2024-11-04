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
        console.log("Files: ", res);
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
        console.log("Files: ", res);
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

export function TestBut() {
  return (
    <UploadButton
      endpoint="logoUploader"
      onClientUploadComplete={async (res) => {
        console.log(res);
        console.log(res[0]);
      }}
      onUploadError={(error: Error) => {
        console.error("Logo upload error:", error);
      }}
    />
  );
}
