import prisma from '@/lib/prisma';
import WorkshopClient from '@/components/workshop/WorkshopClient';
import WorkshopLiveEdit from '@/components/workshop/WorkshopLiveEdit';
import { Workshop } from '@/types';

export default async function EditWorkshop({ params }: { params: { id: number } }) {
  if (isNaN(params.id)) return <div>Erreur 500</div>;
  const workshop = (await prisma.workshop.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      components: {
        orderBy: {
          order: 'asc',
        },
        include: {
          subcomponents: {
            orderBy: {
              order: 'asc',
            },
            include: {
              subsubcomponents: {
                orderBy: {
                  order: 'asc',
                },
              },
            },
          },
        },
      },
    },
  })) as Workshop;

  return (
    <WorkshopClient workshop={workshop} disableBar={true} overflowHidden={true}>
      <div className="flex justify-center w-full min-h-screen bg-gray-100 content">
        <WorkshopLiveEdit workshop={workshop} />
      </div>
    </WorkshopClient>
  );
}
