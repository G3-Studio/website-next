import Header from '@/components/Header';
import WorkshopLoadBar from '@/components/workshop/WorkshopLoadBar';
import { Session } from 'next-auth';

export default function WorkshopLayout({
  children,
  title = '',
  session,
  disableBar = false,
  overflowHidden = false,
}: {
  children: React.ReactNode;
  title: string;
  session?: Session;
  disableBar?: boolean;
  overflowHidden?: boolean;
}) {
  return (
    <WorkshopLoadBar>
      <main className="main">
        <div className="relative w-full h-16">
          <Header title={title} session={session} disableBar={disableBar} />
        </div>

        {children}
      </main>
    </WorkshopLoadBar>
  );
}
