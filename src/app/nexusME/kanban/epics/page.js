import Navbar from "../../Navbar";
import EpicManager from "./EpicManager";
import Loading from "../loading";
import { Suspense } from "react";

export const metadata = {
    title: "Epic Management",
};

export default function EpicsPage() {
    return (
        <>
            <Navbar page={'/nexusME/kanban/epics'} />
            <div style={{ paddingTop: '50px' }}>
                <Suspense fallback={<Loading />}>
                    <EpicManager />
                </Suspense>
            </div>
        </>
    );
} 