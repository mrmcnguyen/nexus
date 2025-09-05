import EisenhowerMatrix from "./EisenhowerMatrixPage";
import Navbar from "../Navbar"
import { Suspense } from "react";
import Loading from './loading'

export const metadata = {
  title: "Eisenhower Matrix",
};

export default function EisenhowerMatrixPage() {
  return (
    <>
      <Navbar page={'/nexusME/eisenhower-matrix'} />
      <div style={{ paddingTop: '50px', backgroundColor: '#171717' }}>
        <Suspense fallback={<Loading />}>
          <EisenhowerMatrix />
        </Suspense>
      </div>
    </>
  );
}
