import WorkshopTitle from "./workshop/WorkshopTitle";
import WorkshopText from "./workshop/WorkshopText";
// import WorkshopImage from "./workshops/title";

function chooseComponent(component: any) : JSX.Element {
    switch (component.type) {
        case "title":
            return <WorkshopTitle id={component.id} data={JSON.parse(component.data)} />
        case "text":
            return <WorkshopText id={component.id} data={JSON.parse(component.data)} />

        default:
            return <></>
        // case "image":
        //     return <WorkshopImage data={component.data} />
    }
}


export default function WorkshopRenderer({ workshop }: { workshop: any }) {
    return (
        <>
            {workshop.components.map((component: any) => {
                let mainComponent = chooseComponent(component);
                let subComponents : Array<JSX.Element> = []
                
                if(!component.subComponents || component.subComponents.length === 0) {
                    return mainComponent;
                }

                component.subComponents.map((subComponent: any) => {
                    subComponents.push(chooseComponent(subComponent));

                    if(!subComponent.subComponents || subComponent.subComponents.length === 0) {
                        return;
                    }
                    subComponent.subComponents.map((subSubComponent: any) => {
                        subComponents.push(chooseComponent(subSubComponent));
                    })
                })

                return (
                    <>
                        {mainComponent}
                        {subComponents}
                    </>
                )
            })}
        </>
    );
}
