import { Hono } from "hono";
const app = new Hono();

app.post("/healthcheck", async (c) => {
    return c.json({ message: "worker is running" });
});

app.post("/embedding", async (c:any) => {
  const { text } = await c.req.json();
  const EMBEDDING_MODEL = c.env.EMBEDDING_MODEL;
  const embeddings:any = await c.env.AI.run(EMBEDDING_MODEL, { text });
  const vectors= embeddings.data[0];
  return c.json({ vectors });
});

app.post("/llm",async (c:any)=>{
  const { llmPromptArray } = await c.req.json();
  const { response } = await c.env.AI.run(c.env.LLM_MODEL, {
    messages: llmPromptArray.map((prompt:any) => ({ role:prompt.role, content: prompt.content })),
  }
  );
  return c.json({ response });
})

app.onError((err:any, c) => {
  console.log("err : ", err);
  return c.text(err.message, err.status ? err.status: 500);
});

export default app;