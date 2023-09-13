import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "fs";
import { openai } from "../lib/openai";

export async function createTranscript(app: FastifyInstance) {
    app.post('/videos/:videoId/transcript', async (req) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid()
        })

        const { videoId } = paramsSchema.parse(req.params)

        const bodySchema = z.object({
            prompt: z.string()
        })

        const { prompt } = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        const audioStream = createReadStream(video.path)

        const response = await openai.audio.transcriptions.create({
            file: audioStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })

        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription: response.text
            }
        })

        return response.text
    })
}