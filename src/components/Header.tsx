"use client";
import Image from 'next/image';
import Link from 'next/link';
import { TextParser } from '@/lib/textParser';

export default function Header({ title = null, session = null }: { title: any, session: any }) {
    return (
        
        <header className="fixed flex flex-col w-full h-16">
            <div className="flex w-full p-3 bg-white">
            <Link href="/" className="flex items-center flex-1 mr-auto">
                <Image src="/temp.jpg" alt="G³ Studio Logo" width={40} height={40} priority />
            </Link>
            <div className="flex items-center justify-center text-center">
                <p className="title" dangerouslySetInnerHTML={{ __html: new TextParser(title).parse() }}></p>
            </div>
            <div className="flex justify-end flex-1 ml-auto">
                {/* User Connected layout */}
                {session && session.user &&
                            <div className="flex items-center justify-end flex-1 mr-auto">
                                <Image src="/temp.jpg" alt="User Avatar" width={40} height={40} priority />
                                <p className="ml-2">{session.user.email}</p>
                            </div>
                }
            </div>
            </div>
            <div className="relative w-full">
            <div className="h-1 bg-gray-300">
                <div className="w-0 h-1 bg-gradient-to-r from-official-yellow to-official-red progress-bar" />
            </div>
            <div className="absolute hidden w-full h-5 bg-red-600 top-1" />
            </div>
        </header>
    );
}