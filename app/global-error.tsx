"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f6f7f9",
          color: "#1e40af",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Swift Horse
          </h1>
          <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
            {error.message || "Application error"}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
