import { StreamingTextResponse } from 'ai';
import { getQualifiedContext } from '@/lib/topK-context';
import { PDFChat, PDFChatMessage } from '@/lib/db/models';
import { NextResponse } from 'next/server';
import { Message } from 'ai/react';

export async function POST(req: Request) {
	try {
		const { messages, chatId } = await req.json();
		const chats = (await PDFChat.find({ _id: chatId }).exec()).map(chat => chat.toJSON());

		if (chats.length !== 1) {
			return NextResponse.json({ error: 'Chat not Found', status: 404 });
		}

		const fileKey = chats[0].fileKey;
		const lastMessage = messages[messages.length - 1];

		const context = await getQualifiedContext(lastMessage.content, fileKey);
		const prompt = {
			role: 'system',
			content: `You are pdf chatbot where you will be provided the context answer the question from the context. If the question is simply conversational answer them accordingly.Be polite and humble.If you are unable to answer simply say "I'm sorry, I don't have information on that topic."
            This is the START CONTEXT:
            ${context}
            END CONTEXT`,
		};

		const response = await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/llm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				llmPromptArray: [prompt, ...messages.filter((message: Message) => message.role === 'user')],
			}),
		});

		const data = await response.json();
		const llmResponse = data.response;
		await PDFChatMessage.create({
			chatId: chatId,
			content: lastMessage.content,
			role: 'user',
		});

		await PDFChatMessage.create({
			chatId: chatId,
			content: llmResponse,
			role: 'system',
		});

		const encoder = new TextEncoder();
		const uint8Array = encoder.encode(llmResponse);

		const readableStream = new ReadableStream({
			start(controller) {
				controller.enqueue(uint8Array);
				controller.close();
			},
		});
		return new StreamingTextResponse(readableStream);
	} catch (error) {
		console.error('Error:', error);
		return new Response('An error occurred', { status: 500 });
	}
}
