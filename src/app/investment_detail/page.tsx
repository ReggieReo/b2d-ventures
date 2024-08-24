import SearchIcon from "./assets/b2dlogo.png";

export default function SearchBar() {
  return (
    <div className="w-[1422px] h-[120px] relative">
        <div className="w-[1800px] h-[120px] p-8 left-0 top-0 absolute bg-white shadow border-b border-[#d9d9d9] justify-start items-center gap-6 inline-flex">
            <div className="grow shrink basis-0 h-8 justify-end items-center gap-2 flex">
                <div className="p-2 bg-neutral-100 rounded-lg justify-center items-center gap-2 flex">
                    <div className="text-[#1e1e1e] text-base font-normal font-['Inter'] leading-none">Investors</div>
                </div>
                <div className="p-2 rounded-lg justify-center items-center gap-2 flex">
                    <div className="text-[#1e1e1e] text-base font-normal font-['Inter'] leading-none">Businesses</div>
                </div>
            </div>
            <div className="px-3 py-2 rounded-lg justify-start items-center gap-2 flex">
                <div className="w-10 h-10 relative rounded-full">
                    <img className="w-10 h-10 left-0 top-0 absolute" src="./assets/kin.gif" />
                </div>
                <div className="w-4 h-4 relative" />
            </div>
        </div>
        <div className="w-[743.12px] h-10 px-4 py-3 left-[335.75px] top-[40px] absolute bg-white rounded-full border border-[#d9d9d9] justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 text-[#b3b3b3] text-base font-normal font-['Inter'] leading-none">Search</div>
            <div className="w-4 h-4 relative" />
        </div>
        <img className="w-[166.89px] h-[120px] left-[84.93px] top-0 absolute" src="./assets/b2dlogo.png" />
    </div>
  );
}
