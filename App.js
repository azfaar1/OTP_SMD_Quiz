import React from "react";
import { Platform, SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { firebaseConfig } from "./firebase";
import { theme } from "./theme";
import { useOtpAuth } from "./useOtpAuth";
import { StepIndicator, PhoneStep, OtpStep, DoneStep, Banner } from "./components";

// Phones use a WebView-based reCAPTCHA modal; the browser (Expo web) uses the normal widget.
const RecaptchaModal =
  Platform.OS === "web" ? null : require("expo-firebase-recaptcha").FirebaseRecaptchaVerifierModal;

export default function App() {
  const auth = useOtpAuth();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      {RecaptchaModal && (
        <RecaptchaModal ref={auth.modalRef} firebaseConfig={firebaseConfig} attemptInvisibleVerification={false} />
      )}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <StepIndicator step={auth.step} />
          <Text style={styles.title}>{theme.title}</Text>
          <Text style={styles.subtitle}>{theme.subtitle}</Text>

          {auth.step === "phone" && (
            <PhoneStep phone={auth.phone} setPhone={auth.setPhone} busy={auth.busy} onSend={auth.sendOtp} />
          )}
          {auth.step === "otp" && <OtpStep otp={auth.otp} setOtp={auth.setOtp} onVerify={auth.verifyOtp} />}
          {auth.step === "done" && <DoneStep user={auth.user} onLogout={auth.logout} />}

          <Banner msg={auth.msg} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  scroll: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: 16 },
  card: {
    width: "100%", maxWidth: 400, padding: 28, backgroundColor: theme.card, borderRadius: theme.radius,
    borderWidth: 1, borderColor: theme.border,
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  title: { fontSize: 24, fontWeight: "800", color: theme.text },
  subtitle: { fontSize: 14, color: theme.muted, marginTop: 6, marginBottom: 24, lineHeight: 20 },
});
