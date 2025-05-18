import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for video processing results
 */
interface VideoProcessingResult {
  success: boolean;
  audioUrl?: string;
  videoUrl?: string;
  processedVideoUrl?: string;
  statusMessage?: string;
  error?: string;
}

/**
 * Process a video by combining it with an audio track
 * Uses Cloudflare Workers for server-side processing
 */
export async function processVideoWithAudio(
  videoUrl: string,
  audioUrl: string
): Promise<VideoProcessingResult> {
  // Get worker endpoint from environment
  const workerEndpoint = process.env.VIDEO_WORKER_ENDPOINT || 'https://doodad-video-worker.doodadai.workers.dev';
  console.log(`[ServerlessVideoProcessor] Using worker endpoint: ${workerEndpoint}`);
  
  // Validate inputs
  if (!videoUrl || !audioUrl) {
    return {
      success: false,
      statusMessage: "Missing video or audio URL",
      error: "Required parameters not provided"
    };
  }
  
  try {
    // Call the Cloudflare Worker to process the video
    const response = await fetch(`${workerEndpoint}/process-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl,
        audioUrl,
      }),
    });
    
    // Handle error responses
    if (!response.ok) {
      console.error(`[ServerlessVideoProcessor] Worker response error: ${response.status} ${response.statusText}`);
      let errorMessage = "Video processing failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If parsing JSON fails, use the default error message
      }
      
      return {
        success: false,
        audioUrl,
        videoUrl,
        statusMessage: `Error processing video: ${errorMessage}`,
        error: errorMessage
      };
    }
    
    // Process successful response
    const result = await response.json();
    console.log(`[ServerlessVideoProcessor] Worker response:`, result);
    
    if (result.success && result.videoUrl) {
      return {
        success: true,
        audioUrl,
        videoUrl,
        processedVideoUrl: result.videoUrl,
        statusMessage: result.message || "Video processed successfully"
      };
    } else {
      return {
        success: false,
        audioUrl,
        videoUrl,
        statusMessage: result.message || "Processing didn't return a video URL",
        error: result.error || "Unknown processing error"
      };
    }
  } catch (error) {
    console.error('[ServerlessVideoProcessor] Error:', error);
    return {
      success: false,
      audioUrl,
      videoUrl,
      statusMessage: `Failed to process video: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 