import { PDFChat } from '@/lib/db/models';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';

type Props = {
	params: {
		chatId: string;
	};
};

const ChatPage = async ({ params: { chatId } }: Props) => {
	const { userId } = await auth();
	if (!userId) return redirect('/signin');
	const chats = (await PDFChat.find({ userId: userId }).exec()).map(chat => chat.toJSON());

	if (!chats) return redirect('/');

	if (
		!chats.find((chat: any) => {
			return chat._id === chatId;
		})
	) {
		return redirect('/');
	}

	const currentChat = chats.find((chat: any) => {
		return chat._id === chatId;
	});

	return (
		<div className="flex max-h-screen overflow-hidden">
			<div className="flex w-full max-h-screen overflow-hidden">
				{/* chat sidebar */}
				<div className="flex-[2] max-w-xs sm:flex hidden">
					<ChatSideBar chats={chats} chatId={chatId} />
				</div>
				{/* chat component */}
				<div className="flex-[4] border-l-4 border-l-slate-200">
					<ChatComponent chatId={chatId} />
				</div>
				{/* pdf viewer */}
				<div className="max-h-screen p-4 oveflow-hidden flex-[3] md:flex hidden">
					<PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
