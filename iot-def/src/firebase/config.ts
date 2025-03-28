import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtHcVgDgEt2ovsLCrKfl7fZZVnqzox6Mw",
  authDomain: "iot-def.firebaseapp.com",
  projectId: "iot-def",
  storageBucket: "iot-def.firebasestorage.app",
  messagingSenderId: "1038810638438",
  appId: "1:1038810638438:web:5d7c02b61a8881f740e5a7",
  measurementId: "G-0HS04PBDN2",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)

export default app

