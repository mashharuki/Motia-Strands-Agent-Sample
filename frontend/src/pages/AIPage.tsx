interface AIPageProps {
  onToggleAI: () => void;
}

export function AIPage({ onToggleAI }: AIPageProps) {
  return (
    <div className="page active" style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background:
              "linear-gradient(135deg,rgba(9,105,218,0.1),rgba(110,64,201,0.1))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
          >
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
            <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
            <path d="M8.56 13A7.97 7.97 0 0 0 4 20" />
            <path d="M15.44 13A7.97 7.97 0 0 1 20 20" />
          </svg>
        </div>
        <div className="page-title" style={{ marginBottom: 8, fontSize: 22 }}>
          AI Assistant
        </div>
        <p
          style={{
            color: "var(--label-secondary)",
            fontSize: 14,
            maxWidth: 400,
            marginBottom: 24,
          }}
        >
          Powered by AWS Strands Agent. Ask questions about your tickets, get
          triage suggestions, and analyze SLA risks.
        </p>
        <button
          className="btn-submit"
          onClick={onToggleAI}
          style={{ minWidth: "auto", padding: "0 24px" }}
        >
          Open AI Chat
        </button>
      </div>
    </div>
  );
}
