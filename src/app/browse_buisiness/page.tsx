import { SignedOut, SignedIn } from "@clerk/nextjs";

import Ip3Card from "~/components/ip3-card";

import { getAllImages } from "~/server/query";
import Image from "next/image";
import Link from "next/link";

async function FImage() {
  const images = await getAllImages();
  return (
    <div>
      {images.map((image, index) => (
        <div key={image.mediaID} className="mx-auto mb-4 w-full max-w-md">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={image.url}
              alt={image.name}
              objectFit="contain"
              width={480}
              height={480}
              priority
            />
          </div>
          <div className="mt-2 text-center">{image.name}</div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className={"mt-12 flex h-screen w-screen flex-col items-center"}>
      <div className={"mb-8 flex w-full max-w-5xl flex-col"}>
        <p className={"text-3xl font-bold"}>Explore Businesses </p>
        <p>Explore emerging investment opportunities on our platform.</p>
      </div>
      <div className="grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
        <Ip3Card />
        <Ip3Card />
        <Ip3Card />
        <Ip3Card />
        <Ip3Card />
      </div>
    </main>
  );
}
