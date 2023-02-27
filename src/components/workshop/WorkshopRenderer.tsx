"use client";
import WorkshopTitle from "./elements/WorkshopTitle";
import WorkshopText from "./elements/WorkshopText";
import React from "react";
import { chooseComponent } from "@/lib/component";

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
