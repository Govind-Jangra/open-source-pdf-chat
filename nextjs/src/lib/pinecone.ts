import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromFirebase } from './firebase-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import { getEmbeddings } from './get-embeddings';
import md5 from 'md5';
import { convertToASCII } from './utils';

export const initializePineconeClient = async () => {
	const pinecone = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY as string,
	});
	return pinecone;
};

type PDFPage = {
	pageContent: string;
	metadata: {
		loc: { pageNumber: number };
	};
};

export async function processPDFFromFirebase(fileKey: string) {
	try {
		const fileName = await downloadFromFirebase(fileKey);
		if (!fileName) {
			throw new Error('Failed to download file from Firebase');
		}

		const loader = new PDFLoader(fileName);
		const pages = (await loader.load()) as PDFPage[];
		const documents = await Promise.all(pages.map(processPDFPage));
		const vectors = await Promise.all(documents.flat().map(embedDocumentContent));
		const client = await initializePineconeClient();
		const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);
		const namespace = convertToASCII(fileKey);
		await pineconeIndex.namespace(namespace).upsert(vectors);

		return documents[0];
	} catch (error) {
		console.error('Error processing PDF:', error);
		return null;
	}
}

async function embedDocumentContent(doc: Document): Promise<PineconeRecord> {
	try {
		const embeddings = await getEmbeddings(doc.pageContent);
		const hash = md5(doc.pageContent);

		return {
			id: hash,
			values: embeddings,
			metadata: {
				text: doc.pageContent as string,
				pageNumber: doc.metadata.pageNumber as number,
			},
		};
	} catch (error) {
		console.error('Error embedding document:', error);
		throw error;
	}
}

export const truncateStringByBytes = (str: string, bytes: number) => {
	const enc = new TextEncoder();
	return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
};

async function processPDFPage(page: PDFPage) {
	let { pageContent, metadata } = page;
	pageContent = pageContent.replace(/\n/g, '');

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 2000,
		chunkOverlap: 200,
	});
	const docs = await splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBytes(pageContent, 36000),
			},
		}),
	]);

	return docs;
}
