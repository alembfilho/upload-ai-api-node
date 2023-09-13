import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { openai } from "../lib/openai";

export async function generateCompletion(app: FastifyInstance) {
    app.post('/ai/completion', async (req, res) => {


        const bodySchema = z.object({
            videoId: z.string().uuid(),
            template: z.string(),
            temperature: z.number().min(0).max(1).default(0.5)
        })

        const { videoId, template, temperature } = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })

        if (!video.transcription) return res.status(400).send({ error: 'Video transcript not generated yet.' })

        const promptMessage = template.replace('{transcript}', video.transcription)

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            temperature,
            messages: [
                { role: "user", content: promptMessage }
            ]
        })

        return response
    })
}