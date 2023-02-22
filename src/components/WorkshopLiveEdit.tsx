import WorkshopRenderer from "./WorkshopRenderer";

export default function WorkshopLiveEdit({ workshop }: { workshop: any }) {

    return (
        <>
            <div className="flex flex-col w-1/2 h-full gap-2 p-5 bg-white">
                
            </div>
            <div className="flex flex-col w-1/2 h-full gap-2 p-5 bg-gray-600">
                <WorkshopRenderer workshop={workshop} />
            </div>
        </>
    );
}