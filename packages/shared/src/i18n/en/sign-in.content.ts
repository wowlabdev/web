import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("signIn", {
  // apps/studio/src/components/account/auth/email-otp-request-step.tsx, apps/studio/src/components/account/auth/email-otp-verify-step.tsx, apps/studio/src/components/account/auth/email-otp-view.tsx +6 more
  "agreement": insert("By signing in, you agree to our {{terms}} and {{privacy}}."),
  "back": "Back",
  "changeEmail": "Use a different email",
  "codeInstructions": insert("Enter the 8-digit code we sent to {{email}}."),
  "continueWithProvider": insert("Continue with {{provider}}"),
  "description": "Pick how you want to log in.",
  "emailFallbackTrigger": "Can't use those? Email me a code",
  "emailLabel": "Email address",
  "emailPlaceholder": "you@example.com",
  "emailRecommendation": "A provider is faster and safer. Go back if you can.",
  "emailTitle": "Sign in with email",
  "otpError": "That code didn't work. Request a new one and try again.",
  "privacyPolicy": "Privacy Policy",
  "secureAuth": "Secure authentication",
  "sendCode": "Email me a code",
  "sendError": "We couldn't send that code. Check the address and try again.",
  "termsOfService": "Terms of Service",
  "title": "Sign in to WoW Lab",
  "verifyCode": "Verify and sign in",
});
