import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
    }}>
      <div style={{
        backgroundColor: "#f7f6f3",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "48px",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
      }}>
        <h1 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "28px",
          color: "#1a1a18",
          marginBottom: "8px",
        }}>
          CrazyWick
        </h1>
        <p style={{
          color: "#6b6b63",
          fontSize: "14px",
          marginBottom: "32px",
          fontFamily: "DM Sans, sans-serif",
        }}>
          Admin access only
        </p>

        <form action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/admin" })
        }}>
          <button type="submit" style={{
            width: "100%",
            padding: "12px 24px",
            backgroundColor: "#1D9E75",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#fff" opacity=".9"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#fff" opacity=".9"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#fff" opacity=".9"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#fff" opacity=".9"/>
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}