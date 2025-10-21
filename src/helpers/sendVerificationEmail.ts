import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Verfication Code Email',
    react: VerificationEmail({ username, otp:verifyCode }),
  });
    return {
      success: true,
      message: "message sent successfully",
    };
  } catch (emailError) {
    console.log("Error sending verfication emails:", emailError);
    return {
      success: false,
      message: "failed to send the email, please try againa later",
    };
  }
}
