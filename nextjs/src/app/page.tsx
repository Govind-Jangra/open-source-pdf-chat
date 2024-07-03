import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";
import FileUpload from "../components/FileUpload";
import { PDFChat } from "@/lib/db/models";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId
  let firstChat;
  if (userId) {
    firstChat = (await PDFChat.find({ userId: userId }).exec()).map(chat=> chat.toJSON());
    
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <>
      <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-5xl font-semibold">Open Source PDF CHAT</h1>
              <UserButton afterSignOutUrl="/"/>
            </div>
            <div className="flex m-2 items-center justify-center">
              {isAuth && firstChat &&
                (
                  <Link href={`/chat/${firstChat._id}`}>
                    <Button>Manage Your Chats<ArrowRight className="ml-2" /></Button>
                  </Link>
                )}
            </div>
            <p className="max-w-xl mt-1 text-lg text-slate-600">
  Now use open source LLM <a href="https://llama.meta.com/llama3/" target="_blank" className="text-blue-500">LLAMA3</a> and Embedding Model <a href="https://huggingface.co/BAAI/bge-base-en-v1.5" className="text-blue-500"  target="_blank">BGE-BASE</a> to chat with your PDF. Your data is safe and secure.
</p>
            <div className="w-full mt-4 rounded-xl shadow-xl">
              {isAuth ?
                (<div className="p-4">
                  <FileUpload />
                </div>) :
                (
                  <Link href="/signin">
                    <Button>Login to get started!
                      <LogIn className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}