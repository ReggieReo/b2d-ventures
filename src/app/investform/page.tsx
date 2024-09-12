import Image from "next/image";

const mockUrls = [
  "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
];

export default function Page() {
  return (
    <div className="my-20 flex flex-col place-items-center gap-4">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-[40px] w-[40px] min-w-[40px]">
          <Image
            src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
            alt="Logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold md:text-4xl">Invest in Rento</div>
        </div>
      </div>
      <div className="text-3xl font-bold md:text-2xl">Investment amount</div>
      <div className="text-3xl font-bold md:text-2xl">Payment information</div>
      <div className="text-3xl font-bold md:text-2xl">Terms</div>
    </div>
  );
}
