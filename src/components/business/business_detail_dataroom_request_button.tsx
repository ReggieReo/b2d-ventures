"use client";
import React, { useState } from "react";
import { RequestDataroomStatusEnum } from "~/utils/enum/requestDataroomStatusEnum";
import { useRouter } from "next/navigation";
import {
  createDataroomRequestAction,
  getRequestAction,
} from "~/server/action/dataroom_request_action";

export function RequestDataroomButton({
  initialRequestStatus,
  pageID,
  onClick,
}: {
  initialRequestStatus: number;
  pageID: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const buttonStyle =
    "w-full rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500";
  const [requestStatus, setRequestStatus] = useState(initialRequestStatus);

  const onclickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented) {
      await createDataroomRequestAction(pageID);
      const status = await getRequestAction(pageID);
      if (!status) {
        setRequestStatus(RequestDataroomStatusEnum.Error.valueOf());
      } else {
        setRequestStatus(status.requestStatus);
      }
    }
  };
  const rounter = useRouter();

  if (requestStatus === RequestDataroomStatusEnum.Pending.valueOf()) {
    return (
      <button disabled={true} className={buttonStyle}>
        Request Pending
      </button>
    );
  }
  if (requestStatus === RequestDataroomStatusEnum.Accepted.valueOf()) {
    return (
      <button
        onClick={() => rounter.push(`/dataroom/${pageID}`)}
        className={buttonStyle}
      >
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
