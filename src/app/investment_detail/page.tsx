export default function LogoAndSearch() {
  return (
    <div className="w-[1422px] h-[120px] p-8 bg-white shadow border-b border-[#d9d9d9] justify-start items-center gap-6 inline-flex">
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
                <img className="w-10 h-10 left-0 top-0 absolute" src="./assets/b2dlogo.png" />
            </div>
            <div className="w-4 h-4 relative" />
        </div>
    </div>
  );
}
