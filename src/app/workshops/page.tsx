import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Workshops() {
  const workshops = await prisma.workshop.findMany();

  return (
    <Layout title="Workshops" session={null}>
      <div className="flex justify-center w-full min-h-screen p-8 bg-gray-100 content">
        {/* Workshops list as cards design using tailwindcss */}
        <div className="flex flex-col flex-wrap items-center justify-start m-auto md:flex-row">
          {workshops.map((workshop) => (
            <Link href={ '/workshops/' + workshop.id } key={workshop.id} className="flex flex-col h-auto overflow-hidden border rounded shadow-lg lg:flex-row lg:h-32">
              <img className="flex-none block w-full h-auto bg-cover lg:w-48" src="https://pbs.twimg.com/media/DrM0nIdU0AEhG5b.jpg" />
              <div className="flex flex-col justify-between w-64 p-4 leading-normal bg-white rounded-b lg:rounded-b-none lg:rounded-r">
                <div className="mb-2 text-xl font-bold leading-tight text-black">Workshop #{workshop.id}</div>
                <p className="text-base text-grey-darker">{workshop.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
