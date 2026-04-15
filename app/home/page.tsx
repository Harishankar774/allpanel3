import { Suspense } from "react";
import HomePageContent from "./HomePageContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0b0e14" }} />}>
      <HomePageContent />
    </Suspense>
  );
}
