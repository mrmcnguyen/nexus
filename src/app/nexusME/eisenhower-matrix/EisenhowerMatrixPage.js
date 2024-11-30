'use client';

import React, { useEffect, useState } from 'react';
import Quadrant from './Quadrant'; // Adjust the path based on your project structure
import { createClient } from '../../../../supabase/client';

export default function EisenhowerMatrixPage() {
  const [tasks, setTasks] = useState({
    doNow: [],
    schedule: [],
    delegate: [],
    eliminate: []
  });

  const [userID, setUserID] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async() => {
      const { data: user, error } = await supabase.auth.getUser();
    if (user) { 
      setUserID(user.user.id);
    } else{
      console.error("Error while fetching user ID: ", error);
    }
  }

    fetchUser();
  }, []);

  const addTask = (quadrant, task) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [quadrant]: [...prevTasks[quadrant], task]
    }));
  };

  return (
    <div className="h-screen flex p-4 bg-[#171717] space-x-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-3/4 h-full">
        <Quadrant
          title="Urgent and Important"
          tasks={tasks.doNow}
          description="Do: Tasks with deadlines or consequences"
          onAddTask={(task) => addTask('doNow', task)}
          bgColor="bg-top-left"
          textBoxColor="#afcfc1"
          borderRoundness="rounded-tl-lg"
          border="border border-[#2F2F2F]"
          userID={userID}
          quadrant={"do"}
        />
        <Quadrant
          title="Not Urgent but Important"
          tasks={tasks.schedule}
          description="Schedule: Tasks with unclear deadlines that contribute to long-term success"
          onAddTask={(task) => addTask('schedule', task)}
          bgColor="bg-top-right"
          textBoxColor="#f2a18d"
          borderRoundness="rounded-tr-lg"
          border="border-t border-r border-b border-[#2F2F2F]"
          userID={userID}
          quadrant={"schedule"}
        />
        <Quadrant
          title="Urgent but Not Important"
          tasks={tasks.delegate}
          description="Delegate: Tasks that must get done but don't require your specific skill set"
          onAddTask={(task) => addTask('delegate', task)}
          bgColor="bg-bottom-left"
          textBoxColor="#98b1e7"
          borderRoundness="rounded-bl-lg"
          border="border-b border-l border-r border-[#2F2F2F]"
          userID={userID}
          quadrant={"delegate"}
        />
        <Quadrant
          title="Not Urgent and Not Important"
          tasks={tasks.eliminate}
          description="Delete: Distractions and unnecessary tasks"
          onAddTask={(task) => addTask('eliminate', task)}
          bgColor="bg-bottom-right"
          textBoxColor="#f5898d"
          borderRoundness="border-b border-r border-[#2F2F2F] rounded-br-lg"
          userID={userID}
          quadrant={"delete"}
        />
      </div>

      <div className="w-1/4 bg-[#1f1f1f] border border-[#2F2F2F] shadow-lg rounded-lg p-6 h-full">
  <h2 className="lg:text-lg 2xl:text-2xl text-gray-300 font-light mb-4">Matrix Management</h2>
  {Object.values(tasks).flat().map((task, index) => (
    <li
      key={index}
      className={`bg-[#292929] text-gray-400 p-2 my-2 rounded-lg px-4 border border-[#454545]`}
    >
      {task}
    </li>
  ))}
</div>
    </div>
  );
}