"use client";
import { TextParser } from "@/lib/text-parser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopTextInput from "../inputs/WorkshopTextInput";

export default function WorkshopTheSmallPlus({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <div key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-2 ws-thesmallplus flex flex-col gap-2 my-2"} >
            <p className="w-full font-bold text-center uppercase">⚙️ LE PETIT + ⚙️</p>
            <p dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
        </div>
    );
}

export function WorkshopTheSmallPlusEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} name="Le petit plus" ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopTextInput id={id + "-text"} title="Texte" placeholder="Section 1" value={data} data={data.text} dataField="text" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopTheSmallPlusDefaultData() {
    return {
        text: "En cas de brûlure, l'eau ça mouille"
    }
}