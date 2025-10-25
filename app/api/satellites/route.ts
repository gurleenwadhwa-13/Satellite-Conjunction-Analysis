import { NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET() {
  try {
    console.log("[v0 API] Fetching satellite TLE data...");

    // Define key Canadian satellites to fetch
    const keyNoradIds = [39089, 32382]; // SAPPHIRE and RADARSAT-2
    const realTLEData = await dataService.fetchBatchTLE(keyNoradIds);

    console.log(
      "[v0 API] Fetched real TLE data for",
      realTLEData.size,
      "satellites"
    );

    // Convert the Map to an array of satellite objects
    const satellites = Array.from(realTLEData.values());

    return NextResponse.json(satellites);
  } catch (error) {
    console.error("[v0 API] Error in satellites API:", error);
    console.log("[v0 API] No satellite data available");
    return NextResponse.json([]);
  }
}
