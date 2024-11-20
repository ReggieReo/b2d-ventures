import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { getUser } from "~/server/repository/user_repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col-reverse items-center justify-center md:flex-row">
      <div className={"w-full px-6 py-8 md:w-1/2 md:px-0"}>
        <div className={"mx-auto max-w-lg"}>
          <div
            className={
              "mb-4 text-center text-5xl font-bold md:text-left md:text-7xl"
            }
          >
            <p>B2D</p>
            <p>Ventures</p>
          </div>
          <div
            className={
              "mb-6 flex flex-col justify-center gap-4 sm:flex-row md:justify-start"
            }
          >
            <Link href={"/browse_business"} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Start Investing
              </Button>
            </Link>
            <Link href={"/create_fundraising"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Start Raising</Button>
            </Link>
          </div>
          <p className={"text-center text-sm md:text-left md:text-base"}>
            Empowering visionaries to transform ideas into reality. At B2D
            Ventures, we bridge the gap between ambitious entrepreneurs and
            strategic investors, creating opportunities that shape tomorrow's
            innovations. Join us in building the next generation of
            groundbreaking businesses.
          </p>
        </div>
      </div>
      <div className={"relative h-[40vh] w-full md:h-screen md:w-1/2"}>
        <Image
          src={"/landing_page_backdrop.png"}
          alt={"Landing Page Backdrop"}
          fill={true}
          objectFit={"cover"}
          priority
        />
      </div>
    </main>
  );
}
