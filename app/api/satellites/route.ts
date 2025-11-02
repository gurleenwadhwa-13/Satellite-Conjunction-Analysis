import { NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET() {
  try {
    const satellites = await dataService.fetchCanadianSubsetFromCelestrak();

    return NextResponse.json(satellites);
  } catch (error) {
    console.error("========================================");
    console.error("ERROR in satellites API:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    console.error(" ========================================");
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
