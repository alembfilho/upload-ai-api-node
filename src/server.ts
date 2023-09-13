import { fastify } from "fastify";
import { uploadVideo } from "./routes/uploadVideo";
import { getAllPrompts } from "./routes/getAllPrompts";
import { createTranscript } from "./routes/createTranscript";
import { generateCompletion } from "./routes/generateAiCompletion";
import fastifyCors from "@fastify/cors";

const app = fastify()

app.register(fastifyCors, { origin: '*' })

app.register(uploadVideo)
app.register(getAllPrompts)
app.register(createTranscript)
app.register(generateCompletion)


app.listen({
    port: 3333
}).then(() => {
    console.log('Server running')
})