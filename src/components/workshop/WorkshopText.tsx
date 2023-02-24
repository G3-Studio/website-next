"use client";
import { TextParser } from '@/lib/textParser'
import WorkshopEditComponentContainer from '@/components/WorkshopEditComponentContainer';
import WorkshopEditInput from '../WorkshopEditInput';

export default function WorkshopText({ id, data }: { id: string, data: any }) {
    return (
        <p key={id} id={id} className="p-1 ws-text" dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTextEdit(params: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={params.id} ondelete={params.events && params.events[3]}>
            <WorkshopEditInput id={params.id + "-data"} title="Texte" placeholder="Ceci est un test !" data={params.data.text} dataField="text" events={params.events}  />
        </WorkshopEditComponentContainer>
    )
}