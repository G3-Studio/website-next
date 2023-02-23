import WorkshopRenderer from '@/components/WorkshopRenderer';
import prisma from '@/lib/prisma';
import WorkshopClient from '@/components/WorkshopClient';
import WorkshopEditBtn from '@/components/WorkshopEditBtn';

export default async function Workshop({ params }: { params: { id: number } }) {
  const workshop = await prisma.workshop.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      components: {
        include: {
          subcomponents: {
            include: {
              subsubcomponents: true,
            },
          },
        },  
      },
    },
  });

  return (
    <WorkshopClient workshop={workshop}>
      <div className="flex justify-center w-full min-h-screen p-8 bg-gray-100 content">
        <div className="flex flex-col flex-1 h-full max-w-5xl gap-2 p-5 bg-white">
          <WorkshopRenderer workshop={workshop} />
          <WorkshopEditBtn id={params.id} />
        </div>
        <div className="fixed right-0 flex hidden w-64 h-full bg-black"></div>
      </div>
    </WorkshopClient>
  );
}
