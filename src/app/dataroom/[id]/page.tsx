import "server-only";

import * as React from "react";
import {
  getBusinessByID,
  getDataroomFiles,
  getLogoByBusinessID,
} from "~/server/fetchQuery";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function Dataroom({ params }: { params: { id: number } }) {
  const files = await getDataroomFiles(params.id);
  const business = await getBusinessByID(params.id);
  const logo = await getLogoByBusinessID(params.id);
  if (!business) {
    redirect("/browse_business");
  }
  if (!files) {
    return (
      <>
        <div>No files found</div>
        <Link href={`/business/${params.id}`}>Go to the business page</Link>
      </>
    );
  }

  return (
    <main className="justify-left m-4 flex min-h-screen flex-col">
      <div className="mb-4 rounded-lg bg-red-400 p-4 text-white">
        <p className="text-xl">
          Warning: These data are classified. If you publish or distribute these
          files, you may be subject to legal action.
        </p>
      </div>
      <Card className={"w-full"}>
        <CardHeader className={"flex flex-row items-center gap-x-5"}>
          <div className="h-16 w-16 overflow-hidden rounded-lg">
            <Image
              src={logo!.url}
              alt="IP3 Logo"
              width={64}
              height={64}
              layout="responsive"
            />
          </div>
          <div className={"flex flex-col"}>
            <CardTitle>{business.company}</CardTitle>
            <CardDescription>{business?.website}</CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Table>
        <TableCaption>A list of dataroom files</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((link) => (
            <TableRow key={link.mediaID}>
              <TableCell>
                <a href={link.url} target="_blank" download={link.url}>
                  {link.name}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
