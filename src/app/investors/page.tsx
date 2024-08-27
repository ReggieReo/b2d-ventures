const mockUrls = [
    "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
    "https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png",
];

export default function Page() {
    return (
        <div className="flex justify-center items-center pt-20">
            <div className="grid grid-rows-3 grid-flow-col gap-4">
                <div className="row-span-3 bg-[#f1f1f1] rounded-[15px] order-3 w-[300px] sm:w-[500px]"></div>
                <div className="col-span-2 bg-[#f1f1f1] rounded-[15px] flex items-center p-10 order-1">
                    <img
                        src={mockUrls[0]}
                        alt="Logo"
                        className="w-[75px] h-[75px] sm:w-[125px] sm:h-[125px] mr-4"
                    />
                    <div className="flex flex-col">
                        <div className="text-black text-[5vw] sm:text-4xl font-bold font-['Inter'] leading-tight">
                            Rento
                        </div>
                        <div className="text-[#494c4f] text-[3vw] sm:text-base font-normal font-['Inter'] leading-snug">
                            Peer-to-Peer Rental Platform
                        </div>
                    </div>
                </div>
                <img className="row-span-2 col-span-2 w-full h-[500px] rounded-lg order-2" src={mockUrls[1]} />
            </div>
        </div>
    );
}
