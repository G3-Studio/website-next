"use client";
import { TextParser } from "@/lib/textParser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopTextInput from "../inputs/WorkshopTextInput";

export default function WorkshopYourTurn({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-yourturn"} dangerouslySetInnerHTML={{ __html: new TextParser("👉 " + data.text).parse() }}></p>
    );
}

export function WorkshopYourTurnEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextInput id={id + "-text"} title="À Ton Tour" placeholder="Section 1"  data={data.text} dataField="text" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopYourTurnDefaultData() {
    return {
        text: "À toi de jouer"
    }
}