import { TextParser } from "@/lib/text-parser";

export default function WorkshopTextInput({ id, title, placeholder, data, dataField, events, list }: { id: string, title: string, placeholder: string, data: string, dataField: string, events?: any, list?: number }) {
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        if(dataField === "wsmaintitle") {
            // find element by Id
            const element = document.querySelector('.title') as HTMLElement;
            // if element exists
            if(element) {
                // Cut element in half after the first ":"
                const split = element.innerHTML.split(":");

                // change the innerText
                element.innerHTML = split[0] + ": " + new TextParser(target.value).parse();
            }
        } else {
            // if list is defined
            let value: any = { [dataField]: target.value }; 

            if(list !== undefined && list) {
                value = data;
                value[dataField][list] = target.value;
            }

            events && events[0](id, value);
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label htmlFor={id} className="text-sm font-medium text-gray-500">{ title }</label>
            <input key={id} onChange={handleChange} type="text" defaultValue={data} name={id} id={id} data-field={dataField} className="w-full h-10 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent" placeholder={placeholder} />
        </div>
    );
}