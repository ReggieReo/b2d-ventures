import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getUser } from "~/server/fetchQuery";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col-reverse md:flex-row items-center justify-center">
      <div className={"w-full px-6 py-8 md:w-1/2 md:px-0"}>
        <div className={"mx-auto max-w-lg"}>
          <div className={"mb-4 text-center md:text-left text-5xl md:text-7xl font-bold"}>
            <p>B2D</p>
            <p>Ventures</p>
          </div>
          <div className={"mb-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"}>
            <Link href={"/browse_business"} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Start Investing
              </Button>
            </Link>
            <Link href={"/create_fundraising"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Start Raising
              </Button>
            </Link>
          </div>
          <p className={"text-center md:text-left text-sm md:text-base"}>
            Empowering visionaries to transform ideas into reality. At B2D Ventures, 
            we bridge the gap between ambitious entrepreneurs and strategic investors, 
            creating opportunities that shape tomorrow's innovations. Join us in building 
            the next generation of groundbreaking businesses.
          </p>
        </div>
      </div>
      <div className={"relative h-[40vh] md:h-screen w-full md:w-1/2"}>
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
