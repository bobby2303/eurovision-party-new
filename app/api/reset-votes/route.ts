import { NextResponse } from "next/server";
import removeVotes from "@/db/remove-votes";

export async function GET() {
    try {
        const result = await removeVotes();
        return NextResponse.json({ success: true, result }, { status: 200 });
      } catch (error) {
        console.error("Error removing votes:", error);
        return NextResponse.json({ error: "Failed to remove votes" }, { status: 500 });
      }
  }