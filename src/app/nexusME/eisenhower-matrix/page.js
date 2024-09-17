import EisenhowerMatrix from "./EisenhowerMatrixPage";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function EisenhowerMatrixPage() {
  return (
    <body className={`min-h-screen ${dmSans.className}`}>
    <Navbar page={'/nexusME/eisenhower-matrix'} />
    <EisenhowerMatrix/>
  </body>
  );
}
