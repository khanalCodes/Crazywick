"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        fontSize: "13px", fontWeight: 500,
        color: "#E24B4A", background: "#fef2f2",
        border: "1px solid #fecaca", borderRadius: "6px",
        padding: "5px 12px", cursor: "pointer",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      Logout
    </button>
  )
}