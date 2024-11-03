import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { business } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { businessID } = await req.json();
    await db.update(business)
      .set({ approve: true })
      .where(eq(business.businessID, businessID))
      .execute();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving business:", error);
    return NextResponse.json({ success: false, error: "Failed to approve business" }, { status: 500 });
  }
}
