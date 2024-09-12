import Image from "next/image";

const mockUrls = [
  "https://utfs.io/f/bb1dabab-7c7c-40d7-8ea5-030fdc7f1d96-ny8zu1.jpg",
];

export default function Page() {
    return (
        <div className="my-20 gap-4 flex flex-col place-items-center">
            <div>Logo & Invest in Rento</div>
            <div>Payment information</div>
            <div>Terms</div>
        </div>
    );
}