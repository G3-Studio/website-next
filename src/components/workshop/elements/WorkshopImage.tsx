"use client";
import { TextParser } from "@/lib/text-parser";
import WorkshopEditComponentContainer from "../WorkshopEditComponentContainer";
import WorkshopImageInput from "../inputs/WorkshopImageInput";
import Image from "next/image";

export default function WorkshopImage({ id, data, onclick }: { id: string, data: any, onclick?: any }) {
    return (
        <div key={id} id={id} onClick={onclick} className={(onclick ? "cursor-pointer " : "") + "p-1 ws-image"}>
            <Image src={data.url} alt="Image Alt" width={500} height={900}></Image>
        </div>
    );
}

export function WorkshopImageEdit({ id, data, events }: {id: string, data: any, events: any}) {
    return (
        <WorkshopEditComponentContainer id={id} name="Image" ondelete={events && events[1]} ondrag={events && events[2]}>
            <WorkshopImageInput id={id + "-url"} title="Image" data={data.url} dataField="url" events={events} />
        </WorkshopEditComponentContainer>
    )
}

export function WorkshopImageDefaultData() {
    return {
        url: "/uploads/workshop/default.jpg"
    }
}