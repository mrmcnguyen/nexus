export default function HelpModal({ isVisible, closeModal }) {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#212121] rounded-lg w-3/5 max-h-[80vh] overflow-hidden">
          <div className="w-full flex flex-col items-center p-6 pb-2 border-b border-[#656565]">
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
              <h2 className="lg:text-lg 2xl:text-2xl font-light">The Eisenhower Matrix</h2>
              <p className="lg:text-xs mx-4 2xl:text-sm text-[#656565]">Nexus ME/Eisenhower Matrix</p>
              </div>
              
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-row w-full justify-between">  {/* Changed this line */}
              <nav>
                <a href="https://todoist.com/productivity-methods/eisenhower-matrix" target="_blank" className="text-blue-500 lg:text-xs 2xl:text-sm mr-2 hover:underline">More Info</a>
                <a href="https://asana.com/resources/eisenhower-matrix" target="_blank" className="text-blue-500 lg:text-xs 2xl:text-sm mr-2 hover:underline">How to Use</a>
                <a href="https://www.productplan.com/glossary/eisenhower-matrix/" target="_blank" className="text-blue-500 lg:text-xs 2xl:text-sm hover:underline">Summary</a>
              </nav>
            </div>
          </div>
          <div className="flex flex-row overflow-y-auto max-h-[70vh]">
            <div className="w-1/3 p-6 border-r border-[#656565]">
              <div className="text-gray-400">
                What is the Eisenhower Matrix?
              </div>
              <div className="p-2 text-gray-300 lg:text-sm 2xl:text-base rounded-lg">
                The Eisenhower Matrix is a time management tool named after Dwight D. Eisenhower, the 34th president of the United States.
                He famously stated, "I have two kinds of problems, the urgent and the important. The urgent are not important, and the important are never urgent."
                <br />
                <br />
                The Eisenhower Matrix has become a widely used tool in various fields, including business, personal productivity, and project management.
                Its simplicity and effectiveness have contributed to its enduring popularity.
              </div>
              <div className="p-2 text-gray-300 lg:text-sm 2xl:text-lg rounded-lg">
                <span className="text-gray-400"></span>{" "}
                <a
                  target="_blank"
                  href="https://ideascale.com/blog/eisenhower-matrix-a-guide/#:~:text=The%20United%20States'%2034th%20President,guide%20on%20the%20Eisenhower%20Matrix."
                  className="lg:text-xs 2xl:text-sm text-blue-500"
                >
                  Source
                </a>
              </div>
            </div>
            <div className="w-2/3 p-6 overflow-y-auto">
              <h2 className="lg:text-xl 2xl:text-2xl font-bold text-gray-300 mb-2">When should I use this?</h2>
              <p className="lg:text-sm 2xl:text-base text-gray-400 mb-2">Use it <a className="underline font-bold decoration-sky-500">
                      anytime.{" "}
                    </a> When you're overwhelmed with a long to-do list, unsure how to prioritize, or need to avoid distractions and improve productivity.
                    It helps identify tasks to delegate and ensures you're focusing on what's most important for your long-term goals.
            </p>
              <h2 className="lg:text-xl 2xl:text-2xl font-bold text-gray-300 mb-2">The Quadrants</h2>
              <ul className="">
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <p>
                    <a className="underline font-bold decoration-sky-500">
                      DO: Urgent and Important:{" "}
                    </a>
                    These are tasks that require immediate attention and are
                    crucial for your goals. Examples include deadlines, crises, or
                    important meetings.
                  </p>
                </li>
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                    SCHEDULE: Not Urgent but Important:{" "}
                  </a>
                  These tasks are important for your long-term goals but don't
                  require immediate action. Examples include planning, learning new
                  skills, or networking.
                </li>
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                    DELEGATE: Urgent but Not Important:{" "}
                  </a>
                  These tasks are pressing but don't contribute significantly to
                  your goals. Examples include phone calls, emails, or
                  interruptions.
                </li>
                <li className="text-gray-400 mb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                    DELETE: Not Urgent and Not Important:{" "}
                  </a>
                  These tasks are neither urgent nor important and can be
                  eliminated or delegated. Examples include social media, watching
                  TV, or mindless browsing.
                </li>
              </ul>
              <h2 className="lg:text-xl 2xl:text-2xl font-bold text-gray-300 mb-2">How to use</h2>
              <p className="lg:text-sm 2xl:text-base text-gray-400 mb-2">Mind dump everything you need to do into the left panel. <b><u>Everything</u></b> you think you need to do. 
                Then, classify each task into each of the four quadrants by dragging them in. Now that you've mapped out all your tasks, get started!
                When you complete a task, you can mark it as done. You can also click tasks to view them, add a description/notes or rename them. You are also encouraged to delete completed
                tasks if everything gets too messy. Boom. Easy.
            </p>
              <h2 className="lg:text-xl 2xl:text-2xl font-bold text-gray-300 mb-2">The Benefits</h2>
              <ul className="">
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <p>
                    <a className="underline font-bold decoration-sky-500">
                    Prioritization:{" "}
                    </a>
                    The Eisenhower Matrix focuses on the nature of prioritizing tasks. This helps you identify the most important tasks and focus on them.
                    When it comes to productivity, people usually underestimate the importance of prioritizing tasks. Focusing on the most important tasks allows you to manage 
                    your time more efficiently and increase the output of your work, achieving more work in less time.
                  </p>
                </li>
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                    Seamless and Easy to Use:{" "}
                  </a>
                  The Matrix is a simple concept that can implemented easily on this page. Simply dump all the tasks on your mind, and organise them.
                </li>
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                  Versatile and Adaptible:{" "}
                  </a>
                  The Matrix can be used for both professional and personal work/goals. This interface provides a seamless and simple experience of making changes
                  and managing the state of tasks.
                </li>
                <li className="text-gray-400 pb-2 lg:text-sm 2xl:text-base">
                  <a className="underline font-bold decoration-sky-500">
                  Because it works! :{" "}
                  </a>
                  The Eisenhower Matrix is one of the top productivity frameworks of all time. It's up there with the Pomodoro, or the Kanban.
                  It's effective because it WORKS. Try it for yourself.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
