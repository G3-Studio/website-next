"use client";
import { TextParser } from '@/lib/text-parser'
import WorkshopEditComponentContainer from '../WorkshopEditComponentContainer';
import WorkshopTextInput from '../inputs/WorkshopTextInput';

export default function WorkshopList({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <div key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-list flex flex-col"}>
            {data.items.map((item: any, index: number) => {
                return (
                    <div key={id + "-item" + (index).toString()} id={id + "-item" + (index).toString()} className='flex items-center gap-4'>
                        <div className='w-1 h-1 bg-black rounded-full'></div>
                        <div dangerouslySetInnerHTML={{ __html: new TextParser(item).parse() }}></div>
                    </div>
                )
            })}
        </div>
    );
}

export function WorkshopListEdit({ id, data, events }: {id: string, data: any, events: any}) {

    return (
        <WorkshopEditComponentContainer id={id} name="List" ondelete={events && events[1]} ondrag={events && events[2]}>
            {data.items.map((item: any, index: number) => {
                return (
                    <WorkshopTextInput key={id + "-item" + (index).toString()} id={id + "-item" + (index).toString()} list={index} title={"Element " + (index + 1).toString()} placeholder="Ceci est un element" data={item} dataField="item" events={events} />
                )
            })}
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopListDefaultData() {
    return {
        items: ["Feu", "Eau", "Air", "Terre"]
    }
}