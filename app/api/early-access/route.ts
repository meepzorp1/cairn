import { NextResponse } from "next/server";
import { Resend } from "resend";

/*
 * Constructed per-request rather than at module scope: the Resend
 * constructor throws when the key is missing, and `.env*` is gitignored,
 * so a module-scope client takes the whole build down on any machine
 * that hasn't got the secret (CI, a fresh clone). Every other secret in
 * the app is already read inside its handler for the same reason.
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const recipient = process.env.EARLY_ACCESS_EMAIL;

    if (!recipient) {
      throw new Error("EARLY_ACCESS_EMAIL is not configured.");
    }

    const { error } = await getResendClient().emails.send({
      from: "Lost Boys <onboarding@resend.dev>",
      to: recipient,
      subject: "New Lost Boys early-access signup",
      replyTo: email,
      text: `New early-access signup: ${email}`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Early-access signup failed:", error);

    return NextResponse.json(
      { error: "Unable to submit the signup right now." },
      { status: 500 },
    );
  }
}
