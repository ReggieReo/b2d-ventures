"use server";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Protect } from "@clerk/nextjs";
import {
  getBusinessByUserID,
  getBusinessByUserIDExplicit,
} from "~/server/repository/business_repository";

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

export async function TopNav() {
  const curUser = auth();
  const hasActiveOrg = curUser?.orgId;
  console.log("hasActiveOrg", hasActiveOrg);

  let business;
  if (curUser) {
    business = await getBusinessByUserIDExplicit(curUser.userId!);
  }
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
          {/* Admin */}
          <Protect condition={(has) => has({ role: "org:admin" })}>
            <Link className={"font-light"} href={"/admin"}>
              Admin
            </Link>
          </Protect>
          <Link className={"font-light"} href={"/browse_business"}>
            Browse Business
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            {!business && (
              <Link className={"font-light"} href={"/create_fundraising"}>
                Start Raising
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center font-light">
                Dashboard <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <a href="/investment_portfolio" className="w-full">
                    Investment Portfolio
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="/startup_dashboard" className="w-full">
                    Business Dashboard
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
