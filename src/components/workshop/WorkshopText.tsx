"use client";
import { TextParser } from '@/lib/textParser'
import WorkshopEditComponentContainer from '@/components/WorkshopEditComponentContainer';
import WorkshopEditInput from '../WorkshopEditInput';

export default function WorkshopText({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-text"} dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTextEdit(params: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={params.id} ondelete={params.events && params.events[1]} ondrag={params.events && params.events[2]}>
            <WorkshopEditInput id={params.id + "-text"} title="Texte" placeholder="Ceci est un test !" data={params.data.text} dataField="text" events={params.events}  />
        </WorkshopEditComponentContainer>
    )
}

export function defaultData() {
    return {
        text: "Exemple de texte"
    }
}