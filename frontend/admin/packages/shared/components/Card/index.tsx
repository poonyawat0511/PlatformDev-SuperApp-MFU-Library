import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="card p-8 rounded-3xl glass gap-8">{children}</div>;
}
