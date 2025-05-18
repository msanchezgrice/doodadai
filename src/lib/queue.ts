import { VideoJobData } from '@/types';

/**
 * Simple in-memory queue implementation
 * In a production environment, this would be replaced with BullMQ or similar
 */
class SimpleQueue {
  private jobs: Record<string, VideoJobData> = {};
  private listeners: ((job: VideoJobData) => Promise<void>)[] = [];

  /**
   * Add a job to the queue
   * @param jobName Unique identifier for the job
   * @param job The job data
   * @returns The job ID
   */
  async add(jobName: string, job: VideoJobData): Promise<string> {
    this.jobs[jobName] = job;
    console.log(`[Queue] Added job ${jobName} to queue`);
    
    // Process the job immediately to simulate a queue
    for (const listener of this.listeners) {
      listener(job).catch(error => {
        console.error(`[Queue] Error processing job ${jobName}:`, error);
      });
    }
    
    return job.jobId;
  }

  /**
   * Register a processor for jobs in the queue
   * @param callback Function to process jobs
   */
  process(callback: (job: VideoJobData) => Promise<void>) {
    this.listeners.push(callback);
    return this;
  }

  /**
   * Get all jobs in the queue
   * @returns Array of jobs
   */
  getJobs(): VideoJobData[] {
    return Object.values(this.jobs);
  }
}

// Export a singleton instance of the queue
export const videoQueue = new SimpleQueue(); 