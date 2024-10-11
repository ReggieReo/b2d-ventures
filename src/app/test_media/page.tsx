import { SignedOut, SignedIn } from "@clerk/nextjs";

import { UploadButtonCom } from "~/components/uploadbuttton";
import { getAllImages } from "~/server/fetchQuery";
import Image from "next/image";

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
    </main>
  );
}
