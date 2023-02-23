"use client";
import WorkshopTitle from "./workshop/WorkshopTitle";
import WorkshopText from "./workshop/WorkshopText";

function chooseComponent(component: any, id: string) : JSX.Element {
    switch (component.type) {
        case "title":
            return <WorkshopTitle id={id} data={JSON.parse(component.data)} />
        case "text":
            return <WorkshopText id={id} data={JSON.parse(component.data)} />
        default:
            return <></>
    }
}


export default function WorkshopRenderer({ workshop }: { workshop: any }) {
    return (
        <>
            {workshop.components.map((component: any) => {
                let identifier = "renderer-components-" + component.id;
                let mainComponent = chooseComponent(component, identifier);
                let subcomponents : Array<JSX.Element> = []
                
                if(!component.subcomponents || component.subcomponents.length === 0) {
                    return mainComponent;
                }

                component.subcomponents.map((subcomponent: any) => {
                    identifier += "-subcomponents-" + subcomponent.id;
                    subcomponents.push(chooseComponent(subcomponent, identifier));

                    if(!subcomponent.subcomponents || subcomponent.subcomponents.length === 0) {
                        return;
                    }
                    subcomponent.subcomponents.map((subsubcomponent: any) => {
                        identifier += "-subsubcomponents-" + subsubcomponent.id;
                        subcomponents.push(chooseComponent(subsubcomponent, identifier));
                    })
                })

                return (
                    <>
                        {mainComponent}
                        {subcomponents}
                    </>
                )
            })}
        </>
    );
}
