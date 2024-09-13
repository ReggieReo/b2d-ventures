import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getUser } from "~/server/query";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-center">
      <div className={"w-1/2 justify-center"}>
        <div className={"max-w-56"}>
          <div className={"mb-4 ml-4 text-7xl font-bold"}>
            <p>B2D</p>
            <p>Ventures</p>
          </div>
          <div className={"mb-4 ml-4 flex flex-row gap-4"}>
            <Button variant="outline">Start Investing</Button>
            <Button>Start Raising</Button>
          </div>
        </div>
        <p className={"ml-5 max-w-fit"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore
        </p>
      </div>
      <div className={"relative h-screen w-1/2"}>
        <Image
          src={"/landing_page_backdrop.png"}
          alt={"Landing Page Backdrop"}
          fill={true}
          objectFit={"cover"}
        ></Image>
      </div>
    </main>
  );
}
