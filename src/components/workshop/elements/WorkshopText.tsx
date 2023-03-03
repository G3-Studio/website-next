"use client";
import { TextParser } from '@/lib/text-parser'
import WorkshopEditComponentContainer from '../WorkshopEditComponentContainer';
import WorkshopTextAreaInput from '../inputs/WorkshopTextAreaInput';

export default function WorkshopText({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-text"} dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTextEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} name="Texte" ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextAreaInput id={id + "-text"} title="Texte" placeholder="Ceci est un test !" value={data} data={data.text} dataField="text" events={events}  />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopTextDefaultData() {
    return {
        text: "Texte"
    }
}