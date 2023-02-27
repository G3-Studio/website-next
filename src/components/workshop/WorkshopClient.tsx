"use client";
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function WorkshopClient({ workshop, disableBar, overflowHidden, children }: { workshop: any, disableBar?: boolean, overflowHidden?: boolean, children: any }) {
    const { data: session } = useSession();

    if(!workshop) {
        return <Layout title="G³ Studio" disableBar={disableBar} overflowHidden={overflowHidden}>Workshop introuvable</Layout>;
    }
  
    return (
      <Layout title={'[span]Workshop #' + workshop?.id + '[/span] : ' + workshop?.title } session={session}>
        {children}
      </Layout>
    );
  }