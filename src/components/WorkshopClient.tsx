"use client";
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function WorkshopClient({ workshop, disableBar, children }: { workshop: any, disableBar?: boolean, children: any }) {
    const { data: session } = useSession();

    if(!workshop) {
        return <Layout title="G³ Studio" disableBar={disableBar} >Workshop introuvable</Layout>;
    }
  
    return (
      <Layout title={'[span]Workshop #' + workshop?.id + '[/span] : ' + workshop?.title } session={session}>
        {children}
      </Layout>
    );
  }