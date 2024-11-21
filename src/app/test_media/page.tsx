import { SignedOut, SignedIn } from "@clerk/nextjs";

import {
  LogoUploadButton,
  TestBut,
  UploadButtonCom,
} from "~/components/util/uploadbuttton";
import Image from "next/image";
import { UploadButton } from "~/utils/uploadthings";
import * as React from "react";
import { getAllImages } from "~/server/repository/media_repository";
export default async function HomePage() {
  const images = await getAllImages();
  return (
    <main className="">
      <div className={"flex flex-col items-center justify-center"}>
        <SignedOut>
          <p>Signed Out</p>
        </SignedOut>

        <SignedIn>
          {/*<Images />*/}
          <p>Sined IN</p>
        </SignedIn>

        <UploadButtonCom />
        <LogoUploadButton />
      </div>
      <div>
        {images.map((image, i) => (
          <div key={image.mediaID}>
            <Image
              src={image.url}
              alt={"image"}
              style={{ objectFit: "contain" }}
              width={480}
              height={480}
            />
          </div>
        ))}
      </div>
      <TestBut />
    </main>
  );
}
