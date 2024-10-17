import {getAllImages, getBusinessByID, getInvestmentByBusinessID} from "~/server/fetchQuery";

"server-only"

import * as React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

import Image from "next/image";

export const dynamic = "force-dynamic";


export default async function Dataroom({ params }: { params: { id: number }}) {
    const files = await getAllImages()
    const business = await getBusinessByID(params.id)
    return (
        <main className="justify-left m-4 flex min-h-screen flex-col">
            <Card className={"w-full"}>
                <CardHeader className={"flex flex-row items-center gap-x-5"}>
                    <div
                        className="h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                            src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
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
                        <TableRow>
                        <TableCell key={link.mediaID}>
                            {/*TODO: Implement Download File*/}
                            <a href={link.url} download={link.url}>{link.name}</a>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    );
}
