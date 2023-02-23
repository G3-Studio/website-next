export default function WorkshopEditInput(params: {id: string, title: string, placeholder: string, data: string}) {
    // input with label on top left

    return (
        <div className="flex flex-col w-full h-full gap-2 p-5 bg-white">
            <label htmlFor={params.id} className="text-sm font-medium text-gray-500">{ params.title }</label>
            <input type="text" defaultValue={params.data} name={params.id} id={params.id} className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent" placeholder={params.placeholder} />
        </div>
    );
}