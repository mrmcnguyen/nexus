import EisenhowerMatrix from "./EisenhowerMatrixPage";
import Navbar from "../Navbar"
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Eisenhower Matrix",
};

export default function EisenhowerMatrixPage() {
  return (
<>
    <Navbar page={'/nexusME/eisenhower-matrix'} />
    <div style={{ paddingTop: '60px' }}> 
          <EisenhowerMatrix />
        </div>
  </>
  );
}
