"use client";
import { TextParser } from "@/lib/textParser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopEditInput from "../WorkshopEditInput";

export default function WorkshopTitle({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-title"} dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTitleEdit(params: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={params.id} ondelete={params.events && params.events[1]} ondrag={params.events && params.events[2]}>
            <WorkshopEditInput id={params.id + "-text"} title="Titre" placeholder="Section 1"  data={params.data.text} dataField="text" events={params.events} />
        </WorkshopEditComponentContainer>
    )
}