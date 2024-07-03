// /api/create-chat/route.ts

import { PDFChat } from "@/lib/db/models";
import { processPDFFromFirebase } from '@/lib/pinecone';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface CreateChatRequestBody {
    fileKey: string;
    fileName: string;
}

const validateRequestBody = (body: any): body is CreateChatRequestBody => {
    return body && typeof body.fileKey === 'string' && typeof body.fileName === 'string';
};

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }  
            );
        }

        const body = await req.json();
        if (!validateRequestBody(body)) {
            console.error('Invalid request body:', body);
            return NextResponse.json(
                { error: 'Bad Request: Missing or invalid parameters' },
                { status: 400 }
            );
        }

        const { fileKey, fileName } = body;

        const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!storageBucket) {
            throw new Error('FIREBASE_STORAGE_BUCKET not found in environment variables');
        }

        const pineconeIndexName = process.env.PINECONE_INDEX;
        if (!pineconeIndexName) {
            throw new Error('PINECONE_INDEX not found in environment variables');
        }

        await processPDFFromFirebase(fileKey);

        const pdfChat = (await PDFChat.create({
            pdfName: fileName,
            pdfUrl: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(fileKey)}?alt=media`,
            fileKey: fileKey,
            userId: userId,
          })).toJSON();
      
          return NextResponse.json({ pdfChatId: pdfChat._id }, { status: 201 });

    } catch (err) {
        console.error('Error creating chat:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
