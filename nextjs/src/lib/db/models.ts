'use server';
import pdfChatModelFactory from './pdfChat';
import messageModelFactory from './pdfChatMessage';
import dbConnectionFactory from './db';

if (!process.env.DATABASE_URL) {
	throw new Error('Database URL not found');
}

const dbConnection = dbConnectionFactory(process.env.DATABASE_URL);

const PDFChat = pdfChatModelFactory(dbConnection);
const PDFChatMessage = messageModelFactory(dbConnection);

export { PDFChat, PDFChatMessage };
