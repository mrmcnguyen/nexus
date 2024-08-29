import MeetingTitle from "../meetingTitle";
import Psection from "./Psection";
import SpeakerNotes from "./speakerNotes";

export default function FivePs() {
    return (
        <main className="flex flex-row min-h-screen items-stretch p-12">
            <div className="w-4/5 text-sm bg-white h-full m-2 border-b border-gray-300 rounded-3xl p-14 overflow-auto">
                <MeetingTitle meetingName="Kevin's Meeting - MOCK PAGE" meetingType="The 5 P's Framework" meetingDate="9:00 AM 12th July 2024" />
                <Psection p="Purpose" placeholder="Define the meeting's main objective." />
                <Psection p="Preparation" placeholder="Outline the necessary preparations." />
                <Psection p="Product" placeholder="Specify the expected outcomes or deliverables." />
                <Psection p="Participants" placeholder="List the key participants and their roles." />
                <Psection p="Process" placeholder="Describe the process or agenda to be followed." />
            </div>
            <div className="w-1/5 bg-white h-full m-2 rounded-3xl p-4 flex-shrink-0">
                <SpeakerNotes content="Enter your notes here" />
            </div>
        </main>
    );
}
