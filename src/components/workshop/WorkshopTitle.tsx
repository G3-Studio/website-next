"use client";
import { TextParser } from "@/lib/textParser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopEditInput from "../WorkshopEditInput";

export default function WorkshopTitle({ id, data }: { id: string, data: any }) {
    return (
        <p key={id} id={id} className="p-1 ws-title" dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTitleEdit(params: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={params.id} ondelete={params.events && params.events[3]} ondrag={params.events && params.events[4]}>
            <WorkshopEditInput id={params.id + "-data"} title="Texte" placeholder="Section 1"  data={params.data.text} dataField="text" events={params.events} />
        </WorkshopEditComponentContainer>
    )
}