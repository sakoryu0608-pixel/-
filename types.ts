export interface ProcessingState {
  status: 'idle' | 'uploading' | 'analyzing' | 'generating' | 'completed' | 'error';
  message?: string;
}

export interface DiagramResult {
  xml: string;
  summary: string;
  fileName: string;
}

export interface FileData {
  file: File;
  base64: string;
  mimeType: string;
}
