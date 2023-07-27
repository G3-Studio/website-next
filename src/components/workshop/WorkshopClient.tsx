'use client';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { Workshop } from '@/types';
import { ReactNode } from 'react';

export default function WorkshopClient({
  workshop,
  disableBar,
  overflowHidden,
  children,
}: {
  workshop: Workshop;
  disableBar?: boolean;
  overflowHidden?: boolean;
  children: ReactNode;
}) {
  const { data: session } = useSession();

  if (!workshop) {
    return (
      <Layout title="G³ Studio" disableBar={disableBar} overflowHidden={overflowHidden}>
        Workshop introuvable
      </Layout>
    );
  }

  return (
    <Layout
      title={'[span]Workshop #' + workshop?.id + '[/span] : ' + workshop?.title}
      session={session ? session : undefined}>
      {children}
    </Layout>
  );
}
