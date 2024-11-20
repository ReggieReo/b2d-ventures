"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "~/utils/uploadthings";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FileIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteDataroomFile,
  getDataroomFilesAction,
  updateDataroomFileType,
} from "~/server/action/dataroom_action";

type DataroomFile = {
  mediaID: number;
  url: string;
  name: string;
  type: string | null;
};

export function DataroomManager({ businessId }: { businessId: number }) {
  const [files, setFiles] = useState<DataroomFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getDataroomFilesAction(businessId);
      setFiles(files);
    };
    void fetchFiles();
  }, [businessId]);

  const handleRemoveFile = async (mediaId: number) => {
    if (confirm("Are you sure you want to remove this file?")) {
      try {
        await deleteDataroomFile(mediaId);
        setFiles(files.filter((file) => file.mediaID !== mediaId));
        router.refresh();
      } catch (error) {
        console.error("Error removing file:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <UploadButton
          endpoint="dataroomUploader"
          onClientUploadComplete={async (res) => {
            if (res) {
              const newFiles = res.map((file) => ({
                mediaID: 0, // This will be updated when fetching
                url: file.url,
                name: file.name,
                type: "dataroom",
              }));
              setFiles([...files, ...newFiles]);
              await updateDataroomFileType(
                newFiles.map((file) => file.url),
                businessId,
              );
              router.refresh();
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Dataroom upload error:", error);
          }}
        />
      </div>

      <Table>
        <TableCaption>A list of your dataroom files</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.mediaID}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4" />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleRemoveFile(file.mediaID)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
