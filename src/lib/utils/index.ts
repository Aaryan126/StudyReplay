export function isDemoMode(value = process.env.DEMO_MODE): boolean {
  return value !== "false";
}
