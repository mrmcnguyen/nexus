import Navbar from "../Navbar";
import OneThreeFiveFramework from "./OneThreeFive";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "The 1-3-5",
  };

export default function Kanban(){
    return(
        <body className={`text-black ${dmSans.className}`}>
        <Navbar page={'/nexusME/1-3-5'} />
        <OneThreeFiveFramework/>
        </body>
    )
}