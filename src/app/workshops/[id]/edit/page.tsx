import prisma from "@/lib/prisma";
import WorkshopRenderer from "@/components/WorkshopRenderer";
import WorkshopClient from "@/components/WorkshopClient";
import WorkshopLiveEdit from "@/components/WorkshopLiveEdit";

export default async function EditWorkshop({ params }: { params: { id: number } }) {
  const workshop = await prisma.workshop.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      components: {},
    },
  });

  return (
    <WorkshopClient workshop={workshop}>
      <div className="flex justify-center w-full min-h-screen bg-gray-100 content">
        <WorkshopLiveEdit workshop={workshop} />
      </div>
    </WorkshopClient>
  );
}
