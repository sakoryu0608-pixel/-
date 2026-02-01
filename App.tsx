import React, { useState, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResultView } from './components/ResultView';
import { ProcessingState } from './components/ProcessingState';
import { ProcessingState as ProcessStateType, DiagramResult } from './types';
import { fileToBase64 } from './utils/fileHelpers';
import { generateDiagramFromAudio } from './services/geminiService';

const App: React.FC = () => {
  const [processingState, setProcessingState] = useState<ProcessStateType>({ status: 'idle' });
  const [result, setResult] = useState<DiagramResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
        setProcessingState({ status: 'error', message: '音声または動画ファイルを選択してください。' });
        return;
    }

    try {
      setProcessingState({ status: 'uploading' });
      const base64 = await fileToBase64(file);
      
      setProcessingState({ status: 'analyzing' });
      // Artificial delay for better UX (so the user sees the step)
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingState({ status: 'generating' });
      const { xml, summary } = await generateDiagramFromAudio(base64, file.type);
      
      setResult({
        xml,
        summary,
        fileName: file.name.replace(/\.[^/.]+$/, "") + ".drawio"
      });
      setProcessingState({ status: 'completed' });

    } catch (error: any) {
      console.error(error);
      setProcessingState({ 
        status: 'error', 
        message: error.message || '予期せぬエラーが発生しました。もう一度お試しください。' 
      });
    } finally {
        // Reset input value to allow same file selection again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  }, []);

  const handleReset = () => {
    setProcessingState({ status: 'idle' });
    setResult(null);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm">
               D
             </div>
             <h1 className="text-xl font-bold text-gray-800 tracking-tight">AudioFlow <span className="text-gray-400 font-normal">to Draw.io</span></h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">Powered by Gemini 3.0 Pro</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            
          <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            
            {processingState.status === 'idle' && (
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center animate-fade-in-up transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">音声から業務フロー図を作成</h2>
                  <p className="text-gray-600">MTGの録音ファイルをアップロードするだけで、AIが自動的にDraw.io形式のフローチャートを生成します。</p>
                </div>
                
                <div 
                    className="p-12 border-2 border-dashed border-gray-300 m-8 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={triggerFileUpload}
                >
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-gray-700">音声ファイルを選択</p>
                            <p className="text-sm text-gray-500">MP3, WAV, M4A, MP4 (Video) supported</p>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-medium shadow-md hover:bg-blue-700 transition-colors">
                            ファイルを選択
                        </button>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                />
              </div>
            )}

            {(processingState.status === 'uploading' || processingState.status === 'analyzing' || processingState.status === 'generating') && (
               <ProcessingState status={processingState.status as any} />
            )}

            {processingState.status === 'error' && (
               <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 flex flex-col items-center text-center">
                  <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">エラーが発生しました</h3>
                  <p className="text-gray-600 mb-6">{processingState.message}</p>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    戻る
                  </button>
               </div>
            )}

            {processingState.status === 'completed' && result && (
               <ResultView result={result} onReset={handleReset} />
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;