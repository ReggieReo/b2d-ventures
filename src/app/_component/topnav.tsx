"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { z } from "zod";
// import Link from "next/link";

function Logo() {
  return (
    <Link href={"/"}>
      <Image
        src={"/r.svg"}
        alt={"logo"}
        width={50}
        height={50}
        style={{ objectFit: "fill" }}
      />
    </Link>
  );
}

export function TopNav() {
  // const router = useRouter(); to refresh

  return (
    <nav
      className={
        "flex max-h-16 w-full items-center justify-between border-b bg-white p-4 text-xl font-semibold text-black"
      }
    >
      <div>
        <Logo />
      </div>
      <div className={"flex flex-row space-x-4"}>
        <Link href={"/api"}>{/*<div>asdf</div>*/}</Link>
        <div className={"flex flex-row gap-4"}>
          <Link className={"font-light"} href={"/browse_buisiness"}>
            Browse Business
          </Link>
          <Link className={"font-light"} href={"/investor_portfolio"}>
            My Portfolio
          </Link>
          <Link className={"font-light"} href={"/test_media"}>
            Test Media Page
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
