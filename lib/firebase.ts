"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDqcdLO6Ta3HoY8R-hZVHPf8m6ylvI5fRc",
  authDomain: "enqueteurosint.firebaseapp.com",
  projectId: "enqueteurosint",
  storageBucket: "enqueteurosint.firebasestorage.app",
  messagingSenderId: "632609470167",
  appId: "1:632609470167:web:3f0965f7d638d21bec2292",
  measurementId: "G-CEV7EZTJ22",
}

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

export { app, auth }
