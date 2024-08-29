export default function SpeakerNotes({ content }) {
    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Speaker Notes</h2>
            <textarea
                className="flex-grow rounded-lg focus:outline-none resize-none"
                placeholder="Enter your notes here..."
            />
        </div>
    );
}
