import Image from "next/image";

export default function DashboardHeader({ organisation, manager, status }) {
  return (
      <div className="w-full shadow-sm rounded-lg mb-4">
          <div className="flex items-center justify-between">
              {/* Organisation, Manager, and Status Info */}
              <div className="flex space-x-6">
                  {/* Organisation */}
                  <div>
                      <div className="text-xs text-gray-500">Organisation</div>
                      <h1 className="text-lg">{organisation}</h1>
                  </div>

                  {/* Project Manager */}
                  <div>
                      <div className="text-xs text-gray-500">Project Manager</div>
                      <h1 className="text-lg">{manager}</h1>
                  </div>

                  {/* Status */}
                  <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <h1 className={`text-lg ${
                          status === "Active" ? "text-emerald-300" : 
                          status === "Behind" ? "text-red-500" : 
                          "text-gray-800"
                      }`}>
                          {status}
                      </h1>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                  {/* Notification Button */}
                  <div className="relative">
                      <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                          <Image
                              src={'/notification.svg'}
                              alt="Notification Bell Icon"
                              width={20}
                              height={20}
                              className="text-gray-600"
                          />
                      </button>
                      <span className="absolute top-0 right-0 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                  </div>

                  {/* Account Button */}
                  <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                      <Image
                          src={'/accountBlue.svg'}
                          alt="Account Icon"
                          width={20}
                          height={20}
                          className="text-gray-600"
                      />
                  </button>
              </div>
          </div>
      </div>
  );
}