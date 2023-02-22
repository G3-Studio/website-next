"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function WorkshopEditBtn(params: { id: number }) {
    const { data: session } = useSession();

    if(!session || !params.id) {
        return null;
    }

    console.log(params.id)

    return (
        <Link href={'/workshops/' + params.id.toString() + '/edit'} className="fixed flex items-center justify-center w-12 h-12 rounded-full bottom-4 right-4 bg-official-yellow">
          <svg className="w-6 h-6 m-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-2-9-7-7-9 9 7 7z"></path>
          </svg>
        </Link>
    );
}