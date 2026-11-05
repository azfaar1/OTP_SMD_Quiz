import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase web app config (Project settings > General > Your apps)
export const firebaseConfig = {
  apiKey: "AIzaSyB5SGTbXaDXPxT3FT868fEQH6enmEyrPI0",
  authDomain: "otp-class-task.firebaseapp.com",
  projectId: "otp-class-task",
  storageBucket: "otp-class-task.firebasestorage.app",
  messagingSenderId: "41150969285",
  appId: "1:41150969285:web:7e8ea2161e2d0e8f8fc7ac",
};

const alreadyInitialised = getApps().length > 0;
export const app = alreadyInitialised ? getApp() : initializeApp(firebaseConfig);

// On phones the auth session is kept in AsyncStorage; on web the default persistence is used.
export const auth =
  Platform.OS === "web" || alreadyInitialised
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
