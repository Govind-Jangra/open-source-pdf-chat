import mongoose, { Schema, Connection } from "mongoose";

// Define the pdfChatMessageSchema
const userSystemEnum = ["system", "user", "assistant"];  // Define the enum for roles
const pdfChatMessageSchema = new Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'pdf-chat', required: true },  // Reference to the related PDF chat
  content: { type: String, required: true },  // Content of the chat message
  createdAt: { type: Date, default: Date.now },  // Timestamp for when the message was created
  role: { type: String, enum: userSystemEnum, required: true },  // Role of the message sender ('system', 'user', or 'assistant')
});

pdfChatMessageSchema.methods.toJson = function() {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  return obj;
};

// Model factory function for PDFChatMessage
export default function pdfChatMessageModelFactory(connection: Connection) {
  // Create and return the PDFChatMessage model
  const PDFChatMessage = connection.model("pdf-chat-message", pdfChatMessageSchema,"pdf-chat-message");
  return PDFChatMessage;
}
