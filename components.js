import React, { useState } from "react";
import { Platform, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "./theme";

const STEPS = ["phone", "otp", "done"];

export function StepIndicator({ step }) {
  const current = STEPS.indexOf(step);
  return (
    <View style={s.steps}>
      {STEPS.map((name, i) => (
        <View key={name} style={[s.stepBar, i <= current && s.stepBarActive]} />
      ))}
    </View>
  );
}

export function Field({ label, style, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[s.input, focused && s.inputFocused, style]}
        placeholderTextColor={theme.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

export function PrimaryButton({ title, onPress, disabled, variant = "solid" }) {
  const outline = variant === "outline";
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[s.button, outline && s.buttonOutline, disabled && s.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[s.buttonText, outline && s.buttonTextOutline]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function PhoneStep({ phone, setPhone, busy, onSend }) {
  return (
    <View>
      <Field
        label="Phone number (with country code)"
        value={phone}
        onChangeText={setPhone}
        placeholder={theme.phonePlaceholder}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      {Platform.OS === "web" && <View nativeID="recaptcha-container" style={s.captcha} />}
      <PrimaryButton title="Send OTP" onPress={onSend} disabled={busy} />
    </View>
  );
}

export function OtpStep({ otp, setOtp, onVerify }) {
  return (
    <View>
      <Field
        label="Enter the 6-digit code"
        style={s.otpInput}
        value={otp}
        onChangeText={setOtp}
        placeholder={theme.otpPlaceholder}
        keyboardType="number-pad"
        maxLength={6}
      />
      <PrimaryButton title="Verify OTP" onPress={onVerify} />
    </View>
  );
}

export function DoneStep({ user, onLogout }) {
  return (
    <View>
      <View style={s.badge}>
        <Text style={s.badgeMark}>✓</Text>
      </View>
      <Text style={s.success}>Login successful!</Text>
      <View style={s.info}>
        <Text style={s.infoKey}>Phone</Text>
        <Text style={s.infoValue}>{user?.phoneNumber}</Text>
        <Text style={[s.infoKey, s.infoGap]}>UID</Text>
        <Text style={[s.infoValue, s.uid]}>{user?.uid}</Text>
      </View>
      <PrimaryButton title="Sign out" variant="outline" onPress={onLogout} />
    </View>
  );
}

export function Banner({ msg }) {
  if (!msg.text) return null;
  const err = msg.type === "err";
  return (
    <View style={[s.banner, { backgroundColor: err ? theme.dangerBg : theme.successBg }]}>
      <Text style={[s.bannerText, { color: err ? theme.danger : theme.success }]}>{msg.text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  steps: { flexDirection: "row", marginBottom: 20 },
  stepBar: { flex: 1, height: 4, borderRadius: 2, marginRight: 6, backgroundColor: theme.border },
  stepBarActive: { backgroundColor: theme.accent },

  label: { fontSize: 13, fontWeight: "600", color: theme.muted, marginBottom: 8, letterSpacing: 0.3 },
  input: {
    paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: theme.text, backgroundColor: theme.inputBg,
    borderWidth: 1.5, borderColor: theme.inputBorder, borderRadius: theme.radiusSm,
  },
  inputFocused: { borderColor: theme.inputFocus },
  otpInput: { fontSize: 24, letterSpacing: 10, textAlign: "center", fontWeight: "700" },
  captcha: { marginTop: 14, alignItems: "center" },

  button: {
    marginTop: 18, paddingVertical: 15, backgroundColor: theme.accent, borderRadius: theme.radiusSm,
    alignItems: "center", borderWidth: 1.5, borderColor: theme.accent,
  },
  buttonOutline: { backgroundColor: "transparent", borderColor: theme.border },
  buttonText: { color: theme.accentText, fontSize: 16, fontWeight: "700" },
  buttonTextOutline: { color: theme.text },
  disabled: { opacity: 0.5 },

  badge: {
    alignSelf: "center", width: 64, height: 64, borderRadius: 32, marginBottom: 14,
    backgroundColor: theme.successBg, alignItems: "center", justifyContent: "center",
  },
  badgeMark: { fontSize: 30, color: theme.success, fontWeight: "700" },
  success: { fontSize: 20, fontWeight: "700", color: theme.success, textAlign: "center", marginBottom: 16 },
  info: {
    padding: 14, borderRadius: theme.radiusSm, backgroundColor: theme.inputBg,
    borderWidth: 1, borderColor: theme.border,
  },
  infoKey: { fontSize: 11, fontWeight: "700", color: theme.muted, letterSpacing: 1, textTransform: "uppercase" },
  infoGap: { marginTop: 12 },
  infoValue: { fontSize: 15, color: theme.text, marginTop: 4 },
  uid: { fontSize: 12, color: theme.muted },

  banner: { marginTop: 18, padding: 12, borderRadius: theme.radiusSm },
  bannerText: { fontSize: 14, fontWeight: "500", textAlign: "center" },
});
