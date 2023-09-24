import React from "react"
import ReactDOM from "react-dom/client"

import { ThemeProvider } from "@/providers/theme-provider.tsx"
import { Toaster } from "@/providers/toaster.tsx"
import { App } from "./app.tsx"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
