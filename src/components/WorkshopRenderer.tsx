"use client";
import WorkshopTitle from "./workshop/WorkshopTitle";
import WorkshopText from "./workshop/WorkshopText";
import React from "react";

function chooseComponent(component: any, id: string, onclick? : any) : JSX.Element {
    switch (component.type) {
        case "title":
            return <WorkshopTitle key={id} id={id} data={JSON.parse(component.data)} onclick={onclick} />
        case "text":
            return <WorkshopText key={id} id={id} data={JSON.parse(component.data)} onclick={onclick} />
        default:
            return <React.Fragment key={id}></React.Fragment>
    }
}


export default function WorkshopRenderer({ workshop, onclick }: { workshop: any, onclick?: any }) {
    return (
        <>
            {workshop.components.map((component: any) => {
                let identifier = "renderer-components-" + component.order;
                let mainComponent = chooseComponent(component, identifier, onclick);
                let subcomponents : Array<JSX.Element> = []
                
                if(!component.subcomponents || component.subcomponents.length === 0) {
                    return mainComponent;
                }

                component.subcomponents.map((subcomponent: any) => {
                    identifier = "renderer-components-" + component.order + "-subcomponents-" + subcomponent.order;
                    subcomponents.push(chooseComponent(subcomponent, identifier, onclick));

                    if(!subcomponent.subcomponents || subcomponent.subcomponents.length === 0) {
                        return;
                    }
                    subcomponent.subcomponents.map((subsubcomponent: any) => {
                        identifier = "renderer-components-" + component.order + "-subcomponents-" + subcomponent.order + "-subsubcomponents-" + subsubcomponent.order;
                        subcomponents.push(chooseComponent(subsubcomponent, identifier, onclick));
                    })
                })

                return (
                    <div key="main">
                        {mainComponent}
                        
                        <div key="sub">
                            {subcomponents}
                        </div>
                    </div>
                )
            })}
        </>
    );
}
