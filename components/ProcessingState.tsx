import React from 'react';

interface Props {
  status: 'uploading' | 'analyzing' | 'generating';
}

export const ProcessingState: React.FC<Props> = ({ status }) => {
  const steps = [
    { id: 'uploading', label: '音声アップロード中...', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )},
    { id: 'analyzing', label: 'Geminiが音声を解析中...', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )},
    { id: 'generating', label: 'フローチャート生成中...', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )},
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center space-y-8 animate-fade-in">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="text-blue-500 animate-pulse">
           {steps[currentStepIndex].icon}
        </div>
      </div>
      
      <div className="w-full space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex items-center space-x-3 transition-opacity duration-500 ${index === currentStepIndex ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-2 h-2 rounded-full ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm font-medium ${index === currentStepIndex ? 'text-blue-600 scale-105 transform' : 'text-gray-500'}`}>
              {step.label}
            </span>
            {index < currentStepIndex && (
              <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
