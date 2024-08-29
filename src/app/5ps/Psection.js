'use client';

import Tiptap from "../../../components/Tiptap";

export default function Psection({ p, placeholder }) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-medium leading-snug mb-2 text-gray-600">{p}</h2>
            <Tiptap/>
            <textarea
                className="w-full h-24 rounded-lg focus:outline-none resize-none"
                placeholder={placeholder}
            />
        </div>
    );
}
