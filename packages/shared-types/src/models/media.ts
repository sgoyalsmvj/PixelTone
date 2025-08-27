export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  format: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  metadata?: MediaMetadata;
  createdAt: Date;
}

export interface MediaMetadata {
  originalFilename?: string;
  mimeType: string;
  checksum: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  thumbnailUrl?: string;
  previewUrl?: string;
}

export interface ExportFormat {
  type: 'image' | 'video' | 'audio';
  format: string; // 'png', 'mp4', 'wav', etc.
  quality: 'low' | 'medium' | 'high';
  dimensions?: {
    width: number;
    height: number;
  };
  bitrate?: number;
  sampleRate?: number;
}

export interface ExportResult {
  id: string;
  url: string;
  format: ExportFormat;
  size: number;
  processingTime: number;
  expiresAt?: Date;
}