import { fastify } from "fastify";
import { uploadVideo } from "./routes/uploadVideo";
import { getAllPrompts } from "./routes/getAllPrompts";

const app = fastify()

app.register(uploadVideo)
app.register(getAllPrompts)


app.listen({
    port: 3333
}).then(() => {
    console.log('Server running')
})