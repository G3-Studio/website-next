export default function WorkshopEditInput(params: {id: string, title: string, placeholder: string, data: string, dataField?: string, events?: any}) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={params.id} className="text-sm font-medium text-gray-500">{ params.title }</label>
            <input onChange={params.events && params.events[0]} onMouseEnter={params.events && params.events[1]} onMouseLeave={params.events && params.events[2]} type="text" defaultValue={params.data} name={params.id} id={params.id} data-field={params.dataField} className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent" placeholder={params.placeholder} />
        </div>
    );
}