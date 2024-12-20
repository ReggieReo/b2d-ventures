import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "~/components/browsing/topnav";
import { PrivacyConsentForm } from "~/components/privacy/PrivacyConsentForm";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import logger from "~/utils/logger";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { userId } = auth();
  let showPrivacyForm = false;

  if (userId) {
    const userRecord = await db.query.user.findFirst({
      where: eq(user.userID, userId),
    });
    showPrivacyForm = userRecord?.privacy === false;
  }

  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className={`${GeistSans.variable}`}>
          <div className={"grid h-screen grid-rows-[auto,1fr]"}>
            <TopNav />
            <main className={"overflow-y-scroll"}>
              {children} {/*this is page*/}
              {showPrivacyForm && <PrivacyConsentForm />}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
