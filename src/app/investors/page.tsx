const mockUrls = [
    "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
    "https://utfs.io/f/7f073d8d-ade3-4ba3-ade5-165386c8a815-186s3o.png",
];

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 justify-between p-4">
                <div className="w-[803px] h-[20vh] sm:h-[180px] bg-[#f1f1f1] rounded-[15px] flex items-center p-10">
                    <img
                        src={mockUrls[0]}
                        alt="Logo"
                        className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] mr-4"
                    />
                    <div className="flex flex-col">
                        <div className="text-black text-[5vw] sm:text-4xl font-bold font-['Inter'] leading-tight">
                            Rento
                        </div>
                        <div className="text-[#494c4f] text-[3vw] sm:text-base font-normal font-['Inter'] leading-snug">
                            Peer-to-Peer Rental Platform
                        </div>
                    </div>
                    <div className="w-[450px] h-[710px] bg-[#f1f1f1] rounded-[15px]" />
                </div>
                <img className="w-[800px] h-[500px] rounded-lg" src={mockUrls[1]}/>
            </div>
        </div>
    );
}
