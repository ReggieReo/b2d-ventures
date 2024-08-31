import Image from "next/image";

const mockUrls = [
  "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
  "https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png",
];

export default function Page() {
  return (
    <div className="my-10 flex flex-col place-items-center font-[geist-sans]">
      <div className="flex flex-row place-items-center gap-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-row gap-2">
            <div className="relative my-5 sm:h-[25px] sm:w-[25px] md:h-[50px] md:w-[50px]">
              <Image
                src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
                alt="Logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="mx-2 my-3 flex flex-col">
              <div className="text-5xl">Rento</div>
              <div>Peer-to-Peer Rental Platform</div>
            </div>
          </div>
          <div className="relative sm:h-[250px] sm:w-[400px] md:h-[500px] md:w-[800px]">
            <Image
              src="https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png"
              alt="Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="ms-20 flex flex-col">
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
            <button className="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500">
              Invest in Rento
            </button>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 my-10">
        <nav
          className="flex gap-x-1"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 active inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            id="tabs-with-underline-item-1"
            aria-selected="true"
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
          >
            Pitch
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            id="tabs-with-underline-item-2"
            aria-selected="false"
            data-hs-tab="#tabs-with-underline-2"
            aria-controls="tabs-with-underline-2"
            role="tab"
          >
            Discussion
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            id="tabs-with-underline-item-3"
            aria-selected="false"
            data-hs-tab="#tabs-with-underline-3"
            aria-controls="tabs-with-underline-3"
            role="tab"
          >
            Update
          </button>
        </nav>
      </div>
    </div>
  );
}
