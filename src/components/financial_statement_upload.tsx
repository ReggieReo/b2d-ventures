"use client";

import { useState } from "react";
import { UploadButton } from "~/utils/uploadthings";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

export function FinancialStatementUpload() {
  const [hasUploaded, setHasUploaded] = useState(false);
  const router = useRouter();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Financial Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please upload your financial statement (PDF format) before making any investments.
          </p>
          <UploadButton
            endpoint="financialStatementUploader"
            onClientUploadComplete={(res) => {
              setHasUploaded(true);
              alert("Financial statement uploaded successfully!");
              router.refresh();
            }}
            onUploadError={(error: Error) => {
              alert(`Error uploading financial statement: ${error.message}`);
            }}
          />
          {hasUploaded && (
            <p className="text-sm text-green-600">
              Financial statement uploaded successfully! Please wait for admin approval before proceeding with investments. You will be notified by email once approved.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
