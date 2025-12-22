import React from "react";

type CalloutType = "note" | "tip" | "warning" | "important";

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: string }> = {
  note: {
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    icon: "ℹ️",
  },
  tip: {
    bg: "bg-green-500/10",
    border: "border-green-500",
    icon: "💡",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500",
    icon: "⚠️",
  },
  important: {
    bg: "bg-red-500/10",
    border: "border-red-500",
    icon: "🔴",
  },
};

export default function Callout({ type = "note", children }: CalloutProps) {
  const styles = calloutStyles[type] || calloutStyles.note;

  return (
    <div
      className={`callout my-6 rounded-lg border-l-4 p-4 ${styles.bg} ${styles.border}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {styles.icon}
        </span>
        <div className="callout-content flex-1">{children}</div>
      </div>
    </div>
  );
}
