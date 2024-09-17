'use client';

export default function EisenhowerMatrix() {
  return (
    <div className="min-h-screen h-4/5 flex flex-col items-center text-left p-8">
      <h1 className="text-5xl text-black font-bold text-left mb-8 lg:text-7xl">Your Eisenhower Matrix</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
        {/* Quadrant 1: Urgent and Important */}
        <div className="p-6 bg-blue-500 text-white rounded-tl-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Urgent and Important</h2>
          <p className="text-lg">Tasks that need to be done immediately and are crucial for your goals.</p>
        </div>

        {/* Quadrant 2: Not Urgent but Important */}
        <div className="p-6 bg-green-500 text-white rounded-tr-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Not Urgent but Important</h2>
          <p className="text-lg">Tasks that are important but do not need to be done immediately. Focus on these for long-term success.</p>
        </div>

        {/* Quadrant 3: Urgent but Not Important */}
        <div className="p-6 bg-yellow-500 text-white rounded-bl-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Urgent but Not Important</h2>
          <p className="text-lg">Tasks that need to be done quickly but are not crucial. Consider delegating these if possible.</p>
        </div>

        {/* Quadrant 4: Not Urgent and Not Important */}
        <div className="p-6 bg-red-500 text-white rounded-br-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Not Urgent and Not Important</h2>
          <p className="text-lg">Tasks that neither need to be done quickly nor are important. These can be eliminated or minimized.</p>
        </div>
      </div>
    </div>
  );
}
