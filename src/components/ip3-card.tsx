"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function Ip3Card() {
  return (
    <Card className="relative w-full min-w-40 max-w-md">
      {/*  header */}
      <CardHeader className="border-b">
        <div className="relative h-32 w-full">
          <Image
            src="/r.svg"
            alt="IP3 Banner"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <div className="absolute left-4 top-[168px] h-16 w-16 -translate-y-1/2 overflow-hidden rounded-lg border-4 border-white bg-white shadow-lg">
        <Image
          src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
          alt="IP3 Logo"
          width={64}
          height={64}
          layout="responsive"
        />
      </div>

      {/*  des */}
      <CardContent className="content-start p-4 pt-6">
        <h2 className="mb-2 text-2xl font-bold">Rento</h2>
        <p className="mb-4 text-gray-600">
          IP3 is an incubator of web3 inclusive entertainment IP
        </p>

        <div className={"flex flex-row gap-1"}>
          <p className={"font-bold"}>$20,000</p>
          <p>raise</p>
        </div>
        <div className={"flex flex-row gap-1"}>
          <p className={"font-bold"}>$1,000</p>
          <p>minimum investment</p>
        </div>
        <p className="mb-4 text-gray-500">Studio City, CA</p>

        {/*  catagory */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">MEDIA</Badge>
          <Badge variant="secondary">ARTS & ENTERTAINMENT</Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            AAPI FOUNDERS
          </Badge>
        </div>
      </CardContent>

      {/*/!*  footing *!/*/}
      {/*<CardFooter className="border-t px-4 py-3 text-sm text-gray-500">*/}
      {/*  Republic Funding Portal · Reg CF*/}
      {/*</CardFooter>*/}
    </Card>
  );
}
