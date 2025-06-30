// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://remix-backend-rg80.onrender.com';

export interface UploadResponse {
  file_id: string;
  original_filename: string;
  file_size: number;
  message: string;
}

export interface ProcessResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatus {
  job_id: string;
  status: 'starting' | 'analyzing' | 'processing' | 'applying' | 'completed' | 'error';
  progress: number;
  message: string;
  file_id: string;
  prompt: string;
  created_at: number;
  result_file?: string;
  error?: string;
  elapsed_time?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the API server is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Upload an audio file
   */
  async uploadAudio(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Start audio processing
   */
  async processAudio(fileId: string, prompt: string): Promise<ProcessResponse> {
    const response = await fetch(`${this.baseUrl}/api/process-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Processing failed');
    }

    return response.json();
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${this.baseUrl}/api/status/${jobId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get status');
    }

    return response.json();
  }

  /**
   * Get download URL for result
   */
  getDownloadUrl(jobId: string): string {
    return `${this.baseUrl}/api/result/${jobId}`;
  }

  /**
   * Get streaming URL for audio file
   */
  getAudioUrl(filename: string): string {
    return `${this.baseUrl}/api/audio/${filename}`;
  }

  /**
   * Download the result file
   */
  async downloadResult(jobId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/result/${jobId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Download failed');
    }

    return response.blob();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Upload progress tracking
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload file with progress tracking
 */
export async function uploadWithProgress(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        const errorData = JSON.parse(xhr.responseText);
        reject(new Error(errorData.error || 'Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `${API_BASE_URL}/api/upload-audio`);
    xhr.send(formData);
  });
} 