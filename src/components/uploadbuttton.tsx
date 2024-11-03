"use client";

import { UploadButton } from "~/utils/uploadthings";
import { useRouter } from "next/navigation";

export function UploadButtonCom() {
  const router = useRouter();

  return (
    <UploadButton
      input=""
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
      input=""
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
