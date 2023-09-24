import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isRunningVite() {
  const isViteContext = import.meta.env.VITE_CONTEXT ? true : false
  const hasSomeViteEnvVariables = Object.keys(import.meta.env).some(k => k.startsWith("VITE_"))

  return isViteContext || hasSomeViteEnvVariables
}

export function isSafeContext() {
  if (window.SharedArrayBuffer) {
    console.info("Supports to SharedArrayBuffer is active in this context")
    return true
  } else {
    console.warn("browser does not support SharedArrayBuffer")
    console.info("Maybe this is not a secure context")
    return false
  }
}