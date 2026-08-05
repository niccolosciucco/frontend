export function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${minutes}:${rest}`;
}

export function formatGap(seconds: number): string {
  if (seconds === 0) return "Leader";
  return `+${seconds.toFixed(3)}`;
}
