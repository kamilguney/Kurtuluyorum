import React, { useEffect } from "react";
import ui from "./ui.generated";

export default function App() {
  useEffect(() => {
    document.title = "Kurtuluyorum — Sigarasız Yaşam Takibi";
  }, []);

  return (
    <iframe title="Kurtuluyorum" srcDoc={ui} style={{
      display: "block", flex: 1, width: "100%", minHeight: 0, border: 0,
      backgroundColor: "#FAF6EF",
    }} />
  );
}
