"use client";
import { TextParser } from "@/lib/text-parser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopTextInput from "../inputs/WorkshopTextInput";

export default function WorkshopToGoFurther({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <div key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-2 ws-togofurther flex flex-col gap-2 my-2"} >
            <p className="w-full font-bold text-center uppercase">🚀 Pour aller plus loin 🚀</p>
            <p dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
        </div>
    );
}

export function WorkshopToGoFurtherEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} name="Pour aller plus loin" ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextInput id={id + "-text"} title="Texte" placeholder="Section 1"  data={data.text} dataField="text" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopToGoFurtherDefaultData() {
    return {
        text: "J'ai pas d'idée"
    }
}