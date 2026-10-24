import { normalizeReferralCode } from "./lib/referralCode.js";

export default async (request: Request, context: { params: { code?: string } }) => {
  const referralCode = normalizeReferralCode(context.params.code);
  if (!referralCode) {
    return new Response("Referral link not found.", { status: 404 });
  }

  const destination = new URL("/from-recording-to-practice-workshop.html", request.url);
  destination.searchParams.set("ref", referralCode);

  return Response.redirect(destination, 302);
};

export const config = {
  path: "/r/:code",
};
