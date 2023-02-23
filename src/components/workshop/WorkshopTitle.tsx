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
        <WorkshopEditComponentContainer>
            <WorkshopEditInput id={params.id} title="Texte" placeholder="Section 1"  data={params.data.text} dataField="text" events={params.events} />
        </WorkshopEditComponentContainer>
    )
}