import Razorpay from "razorpay";

// Lazily constructed — Next.js evaluates route modules while collecting page
// data at build time, even for dynamic routes, so a top-level `new Razorpay()`
// would require RAZORPAY_KEY_ID/SECRET to exist during the build itself. These
// are runtime secrets, not build-time ones; constructing on first use avoids
// that coupling entirely.
let instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}
