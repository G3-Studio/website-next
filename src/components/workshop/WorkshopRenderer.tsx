"use client";
import WorkshopTitle from "./elements/WorkshopTitle";
import WorkshopText from "./elements/WorkshopText";
import React, { MouseEvent } from "react";
import { chooseComponent } from "@/lib/component";
import { Component, Subcomponent, Subsubcomponent, Workshop } from "@/types";

export default function WorkshopRenderer({ workshop, onclick }: { workshop: Workshop, onclick?: (e: MouseEvent<Element>) => void }) {
    return (
        <>
            {workshop.components.map((component: Component, index: number) => {
                let identifier = "renderer-components-" + component.order;
                let mainComponent = chooseComponent(component, identifier, onclick);
                let subcomponents : Array<JSX.Element> = []
                
                if(!component.subcomponents || component.subcomponents.length === 0) {
                    return mainComponent;
                }

                component.subcomponents.map((subcomponent: Subcomponent) => {
                    identifier = "renderer-components-" + component.order + "-subcomponents-" + subcomponent.order;
                    subcomponents.push(chooseComponent(subcomponent, identifier, onclick));

                    if(!subcomponent.subsubcomponents || subcomponent.subsubcomponents.length === 0) {
                        return;
                    }
                    subcomponent.subsubcomponents.map((subsubcomponent: Subsubcomponent) => {
                        identifier = "renderer-components-" + component.order + "-subcomponents-" + subcomponent.order + "-subsubcomponents-" + subsubcomponent.order;
                        subcomponents.push(chooseComponent(subsubcomponent, identifier, onclick));
                    })
                })

                return (
                    <div key={"main" + index}>
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
