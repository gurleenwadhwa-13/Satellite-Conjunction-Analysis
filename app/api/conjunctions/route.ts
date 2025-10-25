import { type NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(request: NextRequest) {
  try {
    console.log("[v0 API] Fetching conjunction data...");

    // Only fetch conjunctions for SAPPHIRE (39089) since SOCRATES table is specific to SAPPHIRE
    const keyNoradId = 39089; // SAPPHIRE
    const allConjunctions: any[] = [];

    try {
      console.log("[v0 API] Fetching conjunctions for NORAD", keyNoradId);
      const csvData = await dataService.fetchConjunctionsFromCelestrak(
        keyNoradId
      );
      if (csvData) {
        const conjunctions = dataService.parseSOCRATESData(csvData);
        console.log(
          "[v0 API] Found",
          conjunctions.length,
          "conjunctions for NORAD",
          keyNoradId
        );
        allConjunctions.push(...conjunctions);
      }
    } catch (error) {
      console.log(
        "[v0 API] Failed to fetch conjunctions for NORAD",
        keyNoradId,
        "Error:",
        error
      );
    }

    if (allConjunctions.length > 0) {
      console.log(
        "[v0 API] Returning",
        allConjunctions.length,
        "real conjunction events"
      );
      return NextResponse.json(allConjunctions);
    }

    console.log(
      "[v0 API] No real conjunction data available, returning empty array"
    );
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error("[v0 API] Error in conjunctions API:", error);
    console.log("[v0 API] Error occurred, returning empty array");
    return NextResponse.json([]);
  }
}
