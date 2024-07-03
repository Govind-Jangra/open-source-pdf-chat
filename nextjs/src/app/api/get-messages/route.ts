import {PDFChatMessage } from "@/lib/db/models";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const {chatId } = await req.json();
    const pdfMessage = (await PDFChatMessage.find({ chatId:  chatId }).exec()).map(mess=>mess.toJSON());

    return NextResponse.json(pdfMessage, {status: 200});
}