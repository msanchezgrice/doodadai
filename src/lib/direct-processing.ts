import OpenAI from 'openai';
import { DialogueLine, TTSVoice, Persona } from '@/types';
import { buildDialoguePrompt, parseDialogueResponse } from '@/lib/promptBuilder';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@/lib/r2';
import { processVideoWithAudio } from '@/lib/serverlessVideoProcessor';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available voices for TTS
const AVAILABLE_VOICES: TTSVoice[] = ['alloy', 'fable', 'onyx', 'nova', 'shimmer', 'echo'];

/**
 * Assign a voice to a speaker
 */
function assignVoiceToSpeaker(
  speakerName: string, 
  speakerToVoiceMap: Map<string, TTSVoice>, 
  currentVoiceIndex: number
): { voice: TTSVoice, nextVoiceIndex: number } {
  if (!speakerToVoiceMap.has(speakerName)) {
    const voice = AVAILABLE_VOICES[currentVoiceIndex % AVAILABLE_VOICES.length];
    speakerToVoiceMap.set(speakerName, voice);
    return { voice, nextVoiceIndex: currentVoiceIndex + 1 };
  }
  return { voice: speakerToVoiceMap.get(speakerName)!, nextVoiceIndex: currentVoiceIndex };
}

/**
 * Process a video directly without queuing
 */
export async function processVideoDirectly(
  videoUrl: string,
  personas: Persona[],
  speakingPace: number = 1.0,
  userGuidance?: string
): Promise<{ dialogueText: string, statusMessage: string, audioUrl?: string, videoUrl?: string }> {
  const jobId = uuidv4().substring(0, 8);
  console.log(`[DirectProcess JOB ${jobId}] Starting with ${personas.length} personas`);
  console.log(`[DirectProcess JOB ${jobId}] Environment check: NODE_ENV=${process.env.NODE_ENV}`);
  console.log(`[DirectProcess JOB ${jobId}] OpenAI API Key available: ${!!process.env.OPENAI_API_KEY}`);
  
  try {
    // In a production environment, we would extract or generate these from the video
    // For demonstration, we're using placeholders
    const demoTranscript = "This is a sample transcript. A person is talking about an interesting topic.";
    const actualFrameDescriptions = "Person speaking, office setting, computer screen";

    console.log(`[DirectProcess JOB ${jobId}] Using demo transcript and frame descriptions`);

    // Build the dialogue prompt
    const promptMessages = buildDialoguePrompt(
      demoTranscript, 
      personas, 
      demoTranscript, 
      actualFrameDescriptions, 
      userGuidance
    );
    
    console.log(`[DirectProcess JOB ${jobId}] Generating dialogue text...`);
    const dialogueCompletion = await openai.chat.completions.create({
      model: 'gpt-4o', 
      messages: promptMessages, 
      max_tokens: 280, 
      temperature: 0.7
    });
    
    const aiDialogueResponse = dialogueCompletion.choices[0]?.message?.content;
    if (!aiDialogueResponse) {
      throw new Error('No response content from OpenAI (dialogue generation).');
    }
    
    console.log(`[DirectProcess JOB ${jobId}] Dialogue text generated successfully`);
    console.log(`[DirectProcess JOB ${jobId}] Dialogue: ${aiDialogueResponse.substring(0, 100)}...`);
    
    // Parse the dialogue response
    const dialogueLines: DialogueLine[] = parseDialogueResponse(aiDialogueResponse);
    console.log(`[DirectProcess JOB ${jobId}] Parsed ${dialogueLines.length} lines of dialogue`);
    
    // Proceed only if we have valid dialogue
    if (dialogueLines.length === 0) {
      return {
        dialogueText: aiDialogueResponse,
        statusMessage: "Generated dialogue script but found no speakable lines."
      };
    }
    
    // Proceed with TTS and R2 upload only if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error(`[DirectProcess JOB ${jobId}] Missing OpenAI API key, skipping TTS generation`);
      return {
        dialogueText: aiDialogueResponse,
        statusMessage: "Generated dialogue script, but could not proceed with audio generation (missing API key)."
      };
    }
    
    console.log(`[DirectProcess JOB ${jobId}] Starting TTS generation for ${dialogueLines.length} lines...`);
    
    // Set up voice mapping
    const speakerToVoiceMap = new Map<string, TTSVoice>();
    let currentVoiceIndex = 0;
    
    // Generate TTS for the first line only
    const firstLine = dialogueLines[0];
    const { voice, nextVoiceIndex } = assignVoiceToSpeaker(firstLine.speaker, speakerToVoiceMap, currentVoiceIndex);
    currentVoiceIndex = nextVoiceIndex;
    
    console.log(`[DirectProcess JOB ${jobId}] Generating TTS for line 1/${dialogueLines.length} using voice ${voice}`);
    
    try {
      // Make sure we have a valid line of text to convert to speech
      const textToSpeak = firstLine.text.trim();
      if (!textToSpeak) {
        throw new Error('Empty text for TTS generation');
      }
      
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: textToSpeak,
        speed: speakingPace
      });
      
      console.log(`[DirectProcess JOB ${jobId}] TTS generation successful for line 1`);
      
      // Get the audio as a buffer
      const mp3Data = await mp3Response.arrayBuffer();
      const mp3Buffer = Buffer.from(mp3Data);
      console.log(`[DirectProcess JOB ${jobId}] Audio buffer created: ${mp3Buffer.length} bytes`);
      
      if (mp3Buffer.length === 0) {
        throw new Error('Generated audio buffer is empty');
      }
      
      // Upload to R2
      const audioFileName = `dialogue_${jobId}_line1.mp3`;
      console.log(`[DirectProcess JOB ${jobId}] Uploading TTS audio to R2... filename: ${audioFileName}`);
      
      const uploadedAudio = await uploadToR2(
        mp3Buffer,
        audioFileName,
        'audio/mpeg'
      );
      
      console.log(`[DirectProcess JOB ${jobId}] Audio uploaded successfully`);
      console.log(`[DirectProcess JOB ${jobId}] Audio URL: ${uploadedAudio.url}`);
      
      // Process the video with the audio
      console.log(`[DirectProcess JOB ${jobId}] Processing video with audio...`);
      const videoWithAudio = await processVideoWithAudio(
        videoUrl,
        uploadedAudio.url
      );
      
      if (videoWithAudio.success) {
        console.log(`[DirectProcess JOB ${jobId}] Video processing successful`);
        return { 
          dialogueText: aiDialogueResponse,
          audioUrl: videoWithAudio.audioUrl,
          videoUrl: videoWithAudio.processedVideoUrl || videoWithAudio.videoUrl,
          statusMessage: videoWithAudio.statusMessage || `Generated dialogue script with ${dialogueLines.length} lines and audio.`
        };
      } else {
        console.error(`[DirectProcess JOB ${jobId}] Video processing failed: ${videoWithAudio.statusMessage}`);
        return { 
          dialogueText: aiDialogueResponse,
          audioUrl: uploadedAudio.url,
          videoUrl: videoUrl,
          statusMessage: `Generated dialogue script and audio. ${videoWithAudio.statusMessage}`
        };
      }
    } catch (ttsError) {
      console.error(`[DirectProcess JOB ${jobId}] TTS generation error:`, ttsError);
      
      // Return the dialogue even if TTS fails
      return {
        dialogueText: aiDialogueResponse,
        videoUrl: videoUrl,
        statusMessage: `Generated dialogue script. Audio creation failed: ${ttsError instanceof Error ? ttsError.message : String(ttsError)}`
      };
    }
  } catch (error) {
    console.error(`[DirectProcess JOB ${jobId}] Error:`, error);
    return {
      dialogueText: "",
      statusMessage: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 