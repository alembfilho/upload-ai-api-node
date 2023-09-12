import fastifyMultipart from "@fastify/multipart";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "fs";
import path from 'path';
import { pipeline } from "stream";
import { promisify } from "util";
import { prisma } from "../lib/prisma";


const pump = promisify(pipeline)

export async function uploadVideo(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_048_576 * 25
        }
    })

    app.post('/videos', async (req, res) => {
        const data = await req.file()

        if (!data) {
            return res.status(400).send({ error: 'Missing file' })
        }

        const extension = path.extname(data.filename)

        if (extension !== '.mp3') {
            return res.status(400).send({ error: 'Invalid input type, please upload a MP3' })
        }

        const baseName = path.basename(data.filename, extension)
        const uploadName = `${baseName}-${randomUUID()}${extension}`

        const uploadDestination = path.resolve(__dirname, '../../tmp', uploadName)

        await pump(data.file as any, createWriteStream(uploadDestination) as any)

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination
            }
        })

        return video
    })
}