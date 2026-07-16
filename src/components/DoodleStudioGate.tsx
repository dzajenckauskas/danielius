"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// The doodle studio (canvas drawing, yup-validated send form, Turnstile) is
// only ever usable from the homepage hero. Dynamically importing it here
// keeps its JS out of every other route's bundle entirely, rather than
// merely hiding it after load.
const DoodleLayer = dynamic(
  () => import("@/components/DoodleLayer").then((mod) => mod.DoodleLayer),
  { ssr: false },
);

export function DoodleStudioGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <DoodleLayer />;
}
