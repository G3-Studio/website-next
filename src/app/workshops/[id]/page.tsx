import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import prisma from '../../../lib/prisma';
import { useEffect } from "react";
import ClientComponent from "./ClientComponent";

export default async function Workshop({ params }: { params: { id: number } }) {
  const workshop = await prisma.workshop.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      components: {
        select: { type: true },
      },
    },
  });

  if(!workshop) {
    return <div>Workshop not found</div>
  }

  return (
    <ClientComponent>
      <main className="main">
        <div className="relative w-full h-16">
          <header className="fixed flex flex-col w-full h-16">
            <div className="flex w-full p-3 bg-white">
              <div className="flex items-center flex-1 mr-auto">
                <Image src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
              </div>
              <div className="flex items-center justify-center text-center">
                <p className="title"><span>Workshop #{workshop?.id}</span> : {workshop?.title}</p>
              </div>
              <div className="flex justify-end flex-1 ml-auto">
                <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
              </div>
            </div>
            <div className="relative w-full">
              <div className="h-1 bg-gray-300">
                <div className="h-1 bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-500 progress-bar" />
              </div>
              <div className="absolute hidden w-full h-5 bg-red-600 top-1" />
            </div>
          </header>
        </div>
      
        <div className="flex items-center justify-center w-full h-[800vh] bg-gray-600 content p-8">
          <div className="flex flex-1 h-full"> TEST </div>
          <div className="fixed right-0 flex hidden w-64 h-full bg-black"></div>
        </div>
      </main>
    </ClientComponent>
  );
}
