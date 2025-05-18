import { NextResponse } from 'next/server';
import { Persona } from '@/types';
import { processVideoDirectly } from '@/lib/direct-processing';

export const dynamic = 'force-dynamic';

/**
 * API endpoint for generating video commentary directly without queueing
 */
export async function POST(request: Request) {
  const requestId = Date.now().toString();
  console.log(`[Direct-Generate API] ${requestId} Processing request`);

  try {
    // Extract parameters from the request
    const body = await request.json();
    const { videoUrl, personas = [], speakingPace = 1.0, userGuidance } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Missing required parameter", details: "videoUrl is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(personas) || personas.length === 0) {
      return NextResponse.json(
        { error: "Invalid personas parameter", details: "personas must be a non-empty array" },
        { status: 400 }
      );
    }

    // Do some basic validation on the personas
    const validatedPersonas: Persona[] = personas.map(p => ({
      name: p.name || 'Unknown Character',
      style: p.style || null,
      constraints: p.constraints || null,
      backstory: p.backstory || null,
      voice_preference: p.voice_preference || null,
      tags: Array.isArray(p.tags) ? p.tags : null,
    }));

    console.log(`[Direct-Generate API] ${requestId} Processing video: ${videoUrl}`);
    console.log(`[Direct-Generate API] ${requestId} Using ${validatedPersonas.length} personas`);

    // Process the video directly
    const result = await processVideoDirectly(
      videoUrl,
      validatedPersonas,
      speakingPace,
      userGuidance
    );

    console.log(`[Direct-Generate API] ${requestId} Completed with status: ${result.statusMessage}`);

    // Return the result to the client
    return NextResponse.json({
      message: "Video processed",
      dialogueText: result.dialogueText,
      audioUrl: result.audioUrl,
      videoUrl: result.videoUrl,
      statusMessage: result.statusMessage
    });
  } catch (error) {
    console.error(`[Direct-Generate API] ${requestId} Error:`, error);
    
    return NextResponse.json(
      { 
        error: "Processing error", 
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 