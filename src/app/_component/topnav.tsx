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
        src={"r.svg"}
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
        "flex max-h-16 w-full items-center justify-between border-b p-4 text-xl font-semibold"
      }
    >
      <div>
        <Logo />
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
