import QRCode from "qrcode";
import { normalizeReferralCode } from "./lib/referralCode.js";

export default async (request: Request, context: { params: { code?: string } }) => {
  const referralCode = normalizeReferralCode(context.params.code);
  if (!referralCode) {
    return new Response("Referral QR code not found.", { status: 404 });
  }

  const destination = new URL(`/r/${referralCode}`, request.url);
  const svg = await QRCode.toString(destination.toString(), {
    type: "svg",
    width: 360,
    margin: 1,
    color: { dark: "#102452", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export const config = {
  path: "/api/referral-qr/:code",
};
