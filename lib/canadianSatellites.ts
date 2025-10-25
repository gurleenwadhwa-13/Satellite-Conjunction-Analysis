import type { Satellite } from "./types";

// Generate more realistic TLE data based on current date
export function generateRealisticTLE(satellite: Satellite): Satellite {
  const now = new Date();
  const epochYear = now.getFullYear() % 100;
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const epochDay =
    dayOfYear +
    (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;

  // Update TLE with current epoch
  const line1Parts = satellite.line1.split(" ");
  line1Parts[3] = `${epochYear}${epochDay.toFixed(8).padStart(12, "0")}`;

  return {
    ...satellite,
    line1: line1Parts.join(" "),
  };
}
