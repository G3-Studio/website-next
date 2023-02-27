"use client";
import { TextParser } from "@/lib/textParser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopTextInput from "../inputs/WorkshopTextInput";

export default function WorkshopReminder({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <p key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-reminder"} dangerouslySetInnerHTML={{ __html: new TextParser("💡Rappel : " + data.text).parse() }}></p>
    );
}

export function WorkshopReminderEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextInput id={id + "-text"} title="Rappel" placeholder="Section 1"  data={data.text} dataField="text" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopReminderDefaultData() {
    return {
        text: "Le feu ça brûle"
    }
}