import Image from "next/image";

const mockUrls = [
  "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
  "https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png",
];

export default function Page() {
  return (
    <div className="flex flex-col font-[geist-sans] place-items-center my-10">
        <div className="flex flex-row gap-2 place-items-center">
            <div className="flex flex-col gap-10">
                <div className="flex flex-row gap-2">
                    <div className="relative md:w-[50px] md:h-[50px] sm:w-[25px] sm:h-[25px] my-5">
                        <Image
                            src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
                            alt="Logo"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex flex-col my-3 mx-2">
                        <div className="text-5xl">Rento</div>
                        <div>Peer-to-Peer Rental Platform</div>
                    </div>
                </div>
                <div className="relative md:w-[800px] md:h-[500px] sm:w-[400px] sm:h-[250px]">
                    <Image
                        src="https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png"
                        alt="Logo"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
            <div className="flex flex-col ms-20">
                <div>
                    <div className="text-[32px]">Fund Raised</div>
                    <div className="text-5xl">$332,160</div>
                </div>
                <div className="my-5">
                    <div className="text-xl">investors</div>
                    <div className="text-5xl">302</div>
                </div>
                <div className="my-3">
                    <div className="text-xl">left to invest</div>
                    <div className="text-5xl">4 hours</div>
                </div>
                <div className="my-5">
                    <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                        Invest in Rento
                    </button>
                </div>
            </div>
        </div>
        <div className="flex flex-col pt-5">
            <div>PITCH HIGHLIGHT</div>
        </div>
    </div>
  );
}

{/* <div className="flex items-center justify-center pt-20">
<div className="grid grid-flow-col grid-rows-3 gap-4">
  <div className="order-3 row-span-3 w-[300px] rounded-[15px] sm:w-[500px]"></div>
  <div className="order-1 col-span-2 flex items-center rounded-[15px] p-10">
    <div className="relative md:w-[75px] md:h-[75px] sm:w-[125px] sm:h-[125px]">
      <Image
        src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
        alt="Logo"
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="flex flex-col">
      <div className="text-[5vw] font-bold leading-tight text-black sm:text-4xl">
        Rento
      </div>
      <div className="text-[3vw] font-normal leading-snug text-[#494c4f] sm:text-base">
        Peer-to-Peer Rental Platform
      </div>
    </div>
  </div>
  <img
    className="order-2 col-span-2 row-span-2 h-[500px] w-full rounded-lg"
    src={mockUrls[1]}
  />
</div>
</div> */}
