import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// All authentication state and actions live here; the UI only renders what it returns.
export function useOtpAuth() {
  const [step, setStep] = useState("phone"); // phone | otp | done
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState(null);

  const confirmation = useRef(null);
  const modalRef = useRef(null); // native reCAPTCHA modal
  const webVerifier = useRef(null); // web reCAPTCHA widget

  const say = (text, type = "") => setMsg({ text, type });

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setStep(u ? "done" : "phone");
      }),
    []
  );

  const getVerifier = () => {
    if (Platform.OS !== "web") return modalRef.current;
    if (!webVerifier.current) {
      webVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "normal" });
    }
    return webVerifier.current;
  };

  const sendOtp = async () => {
    const number = phone.trim();
    if (!number.startsWith("+")) return say("Include the country code, e.g. +92...", "err");
    setBusy(true);
    try {
      confirmation.current = await signInWithPhoneNumber(auth, number, getVerifier());
      setStep("otp");
      say("OTP sent. Check your phone.", "ok");
    } catch (e) {
      say(e.code || e.message, "err");
      if (Platform.OS === "web" && webVerifier.current) {
        webVerifier.current.render().then((id) => window.grecaptcha.reset(id));
      }
    }
    setBusy(false);
  };

  const verifyOtp = async () => {
    try {
      await confirmation.current.confirm(otp.trim());
      say("");
    } catch (e) {
      say(e.code === "auth/invalid-verification-code" ? "Wrong code, try again." : e.code || e.message, "err");
    }
  };

  const logout = () => {
    signOut(auth);
    setPhone("");
    setOtp("");
    say("");
  };

  return { step, phone, setPhone, otp, setOtp, msg, busy, user, modalRef, sendOtp, verifyOtp, logout };
}
