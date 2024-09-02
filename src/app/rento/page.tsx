import Image from "next/image";

const mockUrls = [
  "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
  "https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png",
];

export default function Page() {
  return (
    <div className="my-10 flex flex-col font-geist-sans">
      <div className="flex flex-col place-content-center gap-10 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:w-2/3">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-[60px] w-[60px] min-w-[60px]">
              <Image
                src="https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg"
                alt="Logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold md:text-4xl">Rento</div>
              <div className="text-center text-sm md:text-left md:text-base">
                Peer-to-Peer Rental Platform
              </div>
            </div>
          </div>

          <div>
            <Image
              src="https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png"
              alt="Main Content"
              layout="responsive"
              objectFit="cover"
              width={1}
              height={1}
            />
          </div>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col gap-5 p-3 md:w-1/5">
          <div className="text-[24px] font-bold md:text-[28px]">
            Fund Raised
          </div>
          <div className="text-3xl font-bold md:text-4xl">$332,160</div>
          <div className="text-sm text-gray-500 md:text-base">
            6% raised of $5M max goal
          </div>

          <div
            className="my-3 h-2 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="h-full bg-green-600" style={{ width: "25%" }}></div>
          </div>

          <div className="flex flex-row justify-evenly gap-5 md:flex-col">
            <div>
              <div className="text-3xl font-bold md:text-4xl">302</div>
              <div className="text-lg md:text-xl">Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold md:text-4xl">🔥 4 hours</div>
              <div className="text-lg md:text-xl">Left to invest</div>
            </div>
          </div>

          <button className="w-full rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500">
            Invest in Rento
          </button>
          <div className="mt-2 text-center text-sm text-gray-500">
            $300 minimum investment
          </div>
        </div>
      </div>

      <div className="my-8 border-b border-gray-200">
        <nav
          className="flex justify-start gap-x-5 w-full max-w-[90%] mx-auto"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            className="hs-tab-active:font-bold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 inline-flex gap-x-2 whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-base font-medium text-gray-600 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            id="tabs-with-underline-item-1"
            aria-selected="true"
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
          >
            Pitch
          </button>
        </nav>
      </div>
    </div>
  );
}
