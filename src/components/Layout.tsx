import Header from "@/components/Header";
import WorkshopLoadBar from "@/components/WorkshopLoadBar";

export default function WorkshopLayout({ children, title, session, disableBar }: { children: React.ReactNode, title: string, session?: any, disableBar?: boolean }) {
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
