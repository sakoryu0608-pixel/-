import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-16 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6 hidden sm:flex">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <div className="h-px w-8 bg-gray-200"></div>
      <div className="flex flex-col space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
