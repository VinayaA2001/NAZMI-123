import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Use /api/payment/create-intent for payment creation.",
  });
}
