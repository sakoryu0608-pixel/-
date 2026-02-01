import React from 'react';
import { DiagramResult } from '../types';
import { downloadStringAsFile } from '../utils/fileHelpers';

interface ResultViewProps {
  result: DiagramResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const handleDownload = () => {
    downloadStringAsFile(result.xml, result.fileName, 'application/xml');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-900">生成完了</h2>
              <p className="text-sm text-green-700">業務フローの解析とXML生成が成功しました</p>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-2">
          {/* Summary Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              内容の要約
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed border border-gray-100 h-64 overflow-y-auto">
              {result.summary}
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                出力ファイル
              </h3>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 text-center">
                <p className="text-orange-900 font-medium mb-2">{result.fileName}</p>
                <p className="text-orange-700 text-sm mb-4">Draw.io (diagrams.net) 形式</p>
                
                <button
                  onClick={handleDownload}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-all transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  ダウンロードする
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
               <h4 className="text-blue-900 font-medium text-sm mb-1">次のステップ:</h4>
               <p className="text-blue-800 text-xs">
                 ダウンロードしたファイルを <a href="https://app.diagrams.net/" target="_blank" rel="noreferrer" className="underline font-bold">draw.io</a> や <a href="https://app.diagrams.net/" target="_blank" rel="noreferrer" className="underline font-bold">diagrams.net</a> にドラッグ＆ドロップして開いてください。
               </p>
            </div>
          </div>
        </div>
        
        {/* XML Preview Code Block (Collapsed/Small) */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
            <details className="cursor-pointer">
                <summary className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 select-none">
                    XMLコードを確認する (開発者用)
                </summary>
                <div className="mt-3 relative">
                    <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg text-xs overflow-x-auto h-40">
                        {result.xml}
                    </pre>
                </div>
            </details>
        </div>
      </div>
    </div>
  );
};
