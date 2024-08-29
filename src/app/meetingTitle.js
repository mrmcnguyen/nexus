export default function MeetingTitle({ meetingType, meetingDate, meetingName }) {
    return (
        <div className="text-gray-800 mb-5">
            <h1 className="text-4xl font-bold leading-tight mb-2">{meetingName}</h1>
            <h2 className="text-2xl font-medium leading-snug mb-1 text-gray-600">{meetingDate}</h2>
            <h3 className="text-xl font-light leading-relaxed text-gray-500">{meetingType}</h3>
        </div>
    );
}
