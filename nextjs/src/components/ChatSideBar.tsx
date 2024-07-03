'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from './ui/button'
import { MessageCircle, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    chats: any[];
    chatId: string;
}

const ChatSideBar = ({ chats, chatId }: Props) => {
    
    return (
        <>
            <div className="w-full h-screen overflow-hidden p-4 text-gray-200 bg-gray-700">
                <Link href='/'>
                    <Button className='w-full border-dashed border-white border'>
                        <PlusCircle className='mr-2 w-4 h-4' />
                        New Chat
                    </Button>
                </Link>
                <div className="flex flex-col gap-2 mt-2">
                    {chats.map((chat) => (
                        <Link href={`/chat/${(chat._id).toString()}`} key={(chat._id).toString()}>
                            <div className={cn('rounded-lg p-3 text-slate-300 flex items-center', {
                                'bg-lime-500 text-white': (chat._id).toString() === chatId,
                                'hover:text-white duration-400 ease-in-out transition-colors': (chat._id).toString() != chatId,
                            })}>
                                <MessageCircle className='m-2' />
                                <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="absolute bottom-4 left-4">
                    <div className='flex items-center gap-2 text-3xl text-zinc-50 flex-wrap'>
                        <Link href='/' className='hover:text-slate-300'>Home</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatSideBar
