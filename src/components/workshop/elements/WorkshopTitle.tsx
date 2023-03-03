"use client";
import { TextParser } from "@/lib/text-parser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopTextInput from "../inputs/WorkshopTextInput";

export default function WorkshopTitle({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-title"} dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTitleEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} name="Title" ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextInput id={id + "-text"} value={data} title="Texte" placeholder="Section 1"  data={data.text} dataField="text" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopTitleDefaultData() {
    return {
        text: "Titre"
    }
}