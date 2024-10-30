"use client"
import type { business } from "~/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

import {
  Dialog,
  DialogContentNoClose as DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React from "react";
import {RequestDataroomStatusEnum} from "~/utils/enum/requestDataroomStatusEnum";
import {useRouter} from "next/navigation";
import {createDataroomRequestAction, getRequestAction} from "~/server/action/dataroom_request_action";

// function onClickhandler() {
//   useEffect(() => {
//
//   }, []);
// }

function RequestDataroomButton({
                                 initialRequestStatus, pageID
                               }: {
  initialRequestStatus: number,
  pageID: number,
}) {
  const buttonStyle = "w-full rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500"
  const [requestStatus, setRequestStatus] = useState(initialRequestStatus);

  const onclickHandler = async () => {
    await createDataroomRequestAction(pageID);
    const status = await getRequestAction(pageID)
    if (!status) {
      setRequestStatus(RequestDataroomStatusEnum.Error.valueOf());
    } else {
      setRequestStatus(status.requestStatus);
    }
  };
  const rounter = useRouter()

  if (requestStatus === RequestDataroomStatusEnum.Pending.valueOf()) {
    return (
      <button disabled={true} className={buttonStyle}>
        Request Pending
      </button>
    );
  }
  if (requestStatus === RequestDataroomStatusEnum.Accepted.valueOf()) {

    return (
        // TODO: Redirect to Dataroom page
        <button onClick={()=>rounter.push(`/dataroom/${pageID}`)} className={buttonStyle}>
          Access Dataroom
        </button>
    );
  }
  
  if (requestStatus === RequestDataroomStatusEnum.Rejected.valueOf()) {
    return (
        <button disabled={true} className={buttonStyle}>
          Business Rejected the Dataroom Access
        </button>
    );
  }
  if (requestStatus === RequestDataroomStatusEnum.NoRequest.valueOf()) {
    return (
        <button onClick={onclickHandler} className={buttonStyle}>
          Request Access to the Dataroom
        </button>
    );
  }

  if (requestStatus === RequestDataroomStatusEnum.Error.valueOf()) {
    return (
        <button onClick={onclickHandler} className={buttonStyle}>
          Error Please Try Again Later
        </button>
    );
  }
  
  return (
    <button disabled={true} className={buttonStyle}>
      Login to Request Access to the Dataroom
    </button>
  );
}

export function BusinessDetail({
  businessData,
  initialRequestStatus,
}: {
  businessData: typeof business.$inferSelect;
  initialRequestStatus: number;
}) {
  const [status, setStatus] = useState(initialRequestStatus);
  return (
    <div className="font-geist-sans my-10 flex flex-col">
      <div className="flex flex-col place-content-center gap-10 md:flex-row">
        <div className="flex w-full flex-col gap-4 px-4 md:w-1/2">
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
              <div className="text-3xl font-bold md:text-4xl">
                {businessData.company}
              </div>
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

        <div className="flex flex-col gap-5 p-3 md:mt-20 md:w-1/4">
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
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={100}
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

          <Link href={`/create_investment/${businessData.businessID}`}>
            <button className="w-full rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500">
              Invest in {businessData.company}
            </button>
          </Link>
          {/*TODO: pop upppp*/}
          <Dialog>
            <DialogTrigger>
              <RequestDataroomButton pageID={businessData.businessID} initialRequestStatus={initialRequestStatus}/>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Data room request has been sent.</DialogTitle>
                <DialogDescription>
                  You can access Rentos data room after admin approves the
                  request.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <div className="mt-2 text-center text-sm text-gray-500">
            {businessData.min_investment!.toLocaleString()}$ minimum investment
          </div>
        </div>
      </div>

      <div className="my-8 border-b border-gray-200">
        <nav
          className="mx-auto flex w-full max-w-[85%] justify-start gap-x-5"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 active inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-lg font-bold text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:text-blue-500"
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

      <div className="mx-auto mt-8 max-w-[85%]">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-1"
        >
          <h2 className="mb-4 text-2xl font-bold">Why Invest in Rento?</h2>
          <p className="mb-4 text-gray-700">
            Rento is revolutionizing the peer-to-peer rental market by providing
            a seamless platform for people to rent out items they own but seldom
            use. Our mission is to create a sustainable sharing economy where
            everyone can benefit from renting rather than buying.
          </p>
          <h3 className="mb-2 text-xl font-semibold">Key Highlights:</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li className="mb-2">
              Strong market demand with over 1 million registered users.
            </li>
            <li className="mb-2">
              Proprietary technology ensures secure and smooth transactions.
            </li>
            <li className="mb-2">
              Partnered with top insurance providers to protect users and their
              assets.
            </li>
            <li className="mb-2">
              Experienced team with a proven track record in tech and finance.
            </li>
          </ul>
          <p className="mt-4 text-gray-700">
            Join us in this exciting journey and be part of the future of
            sharing!
          </p>
        </div>
      </div>
    </div>
  );
}
