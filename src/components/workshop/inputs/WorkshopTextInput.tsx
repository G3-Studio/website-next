export default function WorkshopTextInput({ id, title, placeholder, data, dataField, events }: { id: string, title: string, placeholder: string, data: string, dataField?: string, events?: any }) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={id} className="text-sm font-medium text-gray-500">{ title }</label>
            <input key={id} onChange={events && events[0]} type="text" defaultValue={data} name={id} id={id} data-field={dataField} className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent" placeholder={placeholder} />
        </div>
    );
}