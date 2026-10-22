import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

export async function isVerifiedHuman(): Promise<boolean> {
  try {
    const { isBot } = await checkBotId();
    return !isBot;
  } catch (error) {
    console.error(
      "[botCheck] checkBotId failed (fail-open, treat as human):",
      error
    );
    return true;
  }
}

export function botDeniedResponse() {
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
