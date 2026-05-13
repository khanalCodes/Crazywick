"use client"

type Props = { action: () => Promise<void> }

export default function DeleteAnalysisButton({ action }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => { if (!confirm("Delete this analysis?")) e.preventDefault() }}
        style={{
          padding: "7px 14px", borderRadius: 7,
          border: "1px solid rgba(226,75,74,0.3)",
          background: "#fef0f0", color: "#E24B4A",
          fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
        }}
      >
        Delete
      </button>
    </form>
  )
}