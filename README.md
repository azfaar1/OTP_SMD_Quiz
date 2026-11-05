# Firebase OTP Demo (React Native / Expo)

Expo app: enter phone number -> solve reCAPTCHA -> receive SMS OTP -> verify -> logged in.
Works on Android, iOS (Expo Go) and in the browser (Expo web). It was converted from the original single-file web demo and the login flow is unchanged.

## Firebase setup
1. https://console.firebase.google.com -> use the project `otp-class-task` (config is in `firebase.js`).
2. Build > Authentication > Get started > Sign-in method > enable **Phone**.
3. (Recommended) Authentication > Sign-in method > Phone > "Phone numbers for testing": add `+16505550101` with code `123456` (no real SMS, no billing needed).
4. Authentication > Settings > Authorized domains: `localhost` is there by default. For phones, also make sure the project's `authDomain` (`otp-class-task.firebaseapp.com`) is listed.

## Run
```
npm install
npx expo start
```
- Press `w` to open it in the browser (http://localhost:8081). Use `localhost`.
- Or scan the QR code with the **Expo Go** app on a phone (same Wi-Fi).
- Press `a` for an Android emulator.

Then enter `+16505550101`, complete the reCAPTCHA, and use code `123456`.

## Project structure
| File | Purpose |
|------|---------|
| `App.js` | Screens and OTP logic (phone -> code -> logged in) |
| `firebase.js` | Firebase config and auth setup (persists the session on phones) |
| `theme.js` | Colours and text; edit this to restyle the app |
| `Screenshots/` | Screenshots and recording of the original web version of the flow |

## Notes
- A Firebase test number never sends an SMS; Firebase compares your input to the fixed code set in the console.
- Phone auth on mobile uses `expo-firebase-recaptcha` (a WebView reCAPTCHA), which works in Expo Go but is deprecated; for a production build consider `@react-native-firebase/auth`.
