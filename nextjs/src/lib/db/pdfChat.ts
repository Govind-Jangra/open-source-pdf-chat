import { Schema, Connection } from 'mongoose';

// Define the pdfChatSchema
const pdfChatSchema = new Schema({
	pdfName: { type: String, required: true }, // Name of the PDF file
	pdfUrl: { type: String, required: true }, // URL where the PDF is stored
	createdAt: { type: Date, default: Date.now }, // Timestamp for when the chat was created
	userId: { type: String, required: true }, // ID of the user who created the chat
	fileKey: { type: String, required: true }, // Unique key for the uploaded file
});

pdfChatSchema.methods.toJSON = function () {
	const obj = this.toObject();
	obj._id = obj._id.toString();
	return obj;
};

// Model factory function
export default function pdfChatModelFactory(connection: Connection) {
	// Create and return the PDFChat model
	const PDFChat = connection.model('pdf-chat', pdfChatSchema, 'pdf-chat');
	return PDFChat;
}
