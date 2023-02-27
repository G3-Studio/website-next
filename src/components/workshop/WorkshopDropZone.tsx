import { getComponent } from "@/lib/component";
import { useState } from "react";

export default function WorkshopDropZone({ id, h, workshop, drop }: { id: string, h?: string, workshop: any, drop: any }) {
    const [allowed, setAllowed] = useState(getAllowedDropZones(id, workshop))
    
    function dragEnter(e: any) {
        e.preventDefault();

        setAllowed(getAllowedDropZones(id, workshop));

        let type = e.dataTransfer.types[0];
        let mode = e.dataTransfer.types[1];

        if(mode == "move") {
            let newAllowed = allowed;

            let component = getComponent(workshop, type);

            let nb = 0;
            if(component.subsubcomponents && component.subsubcomponents.length > 0) {
                nb = 1;
            }

            if(component.subcomponents && component.subcomponents.length > 0) {
                nb = 1;
                component.subcomponents.forEach((subcomponent: any) => {
                    if(subcomponent.subsubcomponents && subcomponent.subsubcomponents.length > 0) {
                        nb = 2; 
                    }
                })
            }

            if (nb > 0){
                newAllowed[2] = 0;
                if (nb == 2) {
                    newAllowed[1] = 0;
                }
            }

            let idArray = type.split("-");

            // if a component is dragged inside itself
            if (idArray.length == 2 && idArray[1] == id.split("-")[2]) {
                newAllowed[1] = 0;
                newAllowed[2] = 0;
            }
            
            // if a subcomponent is dragged inside itself
            if(idArray.length == 4 && idArray[1] == id.split("-")[2] && idArray[3] == id.split("-")[4]) {
                newAllowed[2] = 0;
            }

            setAllowed(newAllowed);
        }

        // remove class to dropzone child
        if(e.target.children[0] && (allowed[0] == 1 || allowed[1] == 1 || allowed[2] == 1)) {
            e.target.classList.add("h-8");
            e.target.children[0].classList.remove("opacity-0");
        }
    }

    function dragLeave(e: any) {
        e.preventDefault();
        // add class to dropzone child
        if(e.target.children[0]) {
            e.target.classList.remove("h-8");
            e.target.children[0].classList.add("opacity-0");
        }
    }

    function dragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        // e.target to HTMLDivElement
        let dropZone = e.target as HTMLDivElement;
        if(dropZone.children[0]) {
            // get mouse position and check if it's in the first, second or other fifth of the dropzone using zones elements in the DOM
            let mousePosition = e.clientX;
            let dropZonePosition = dropZone.getBoundingClientRect().left;
            let dropZoneWidth = dropZone.getBoundingClientRect().width;
        
            let line = dropZone.children[0];
            let dropZoneZones = dropZone.children[1].children;
            let dropZoneZoneWidth = dropZoneWidth / 5;

            let dropZoneZone = 0;

            for(let i = 0; i < dropZoneZones.length; i++) {
                if(mousePosition < dropZonePosition + dropZoneZoneWidth * (i + 1)) {
                    dropZoneZone = i;
                    break;
                }
            }

            if(allowed[0] == 0 && allowed[1] == 0 && allowed[2] == 0) {
                return;
            }

            // check if the dropzone is allowed to be dropped in the current zone if not change the zone
            if(allowed[dropZoneZone] == 0) {
                if(dropZoneZone <= 1) {
                    if(allowed[0] == 1) {
                        dropZoneZone = 0;
                    }else if(allowed[1] == 1) {
                        dropZoneZone = 1;
                    }else if(allowed[2] == 1) {
                        dropZoneZone = 2;
                    }
                }else {
                    if(allowed[2] == 1) {
                        dropZoneZone = 2;
                    }else if(allowed[1] == 1) {
                        dropZoneZone = 1;
                    }else if(allowed[0] == 1) {
                        dropZoneZone = 0;
                    }
                }
            }

            dropZone.dataset.dropZone = dropZoneZone + '';
            dropZone.dataset.componentIds = componentIds().toString();

            setLine(line, dropZoneZone);
        }
    }

    function setLine(line: any, dropZoneZone: number) {
        if(dropZoneZone == 0) {
            line.classList.remove("ml-12");
            line.classList.remove("ml-24");
        }

        if(dropZoneZone == 1) {
            line.classList.add("ml-12");
            line.classList.remove("ml-24");
        }

        if(dropZoneZone == 2) {
            line.classList.remove("ml-12");
            line.classList.add("ml-24");
        }
    }

    function getAllowedDropZones(id: string, workshop: any) {
        // id is composed as follow : "drop-component-[component-id]-subcomponent-[subcomponent-id]-subsubcomponent-[subsubcomponent-id]" or "top" or only "drop-component-[component-id]" or "drop-component-[component-id]-subcomponent-[subcomponent-id]"
        // workshop is the workshop object from the database (see WorkshopRenderer.tsx)
        // use these informations to get the previous component and the next component at the place (for instance if the previous component is a component and the next component is a subcomponent, then the dropzone is allowed to be a subcomponent)
        
        if(id == "drop") {
            return [1, 0, 0];
        }

        // get the previous and next component
        let previousComponent = null;
        let nextComponent = null;

        let idArray = id.split("-");

        // we are already placed as previous component
        if(idArray.length == 3) {
            previousComponent = "component";

            
            let idComponent = idArray[2];
            let component = workshop.components.find((component: any) => component.order == idComponent);

            if(!component) return [0, 0, 0];

            if(component.subcomponents.length > 0) {
                nextComponent = "subcomponent";
            }else {
                nextComponent = "component";
            }
        }else if(idArray.length == 5) {
            previousComponent = "subcomponent";


            let idSubcomponent = idArray[4];
            let idComponent = idArray[2];
            let component = workshop.components.find((component: any) => component.order == idComponent);
            let subcomponent = component.subcomponents.find((subcomponent: any) => subcomponent.order == idSubcomponent);

            if(!subcomponent) return [0, 0, 0];

            if(subcomponent.subsubcomponents.length > 0) {
                nextComponent = "subsubcomponent";
            }else {
                // if the current subcomponent is the last one, then the next component is a component
                if(component.subcomponents.length > 0 && component.subcomponents[component.subcomponents.length - 1].order == idSubcomponent) {
                    nextComponent = "component";
                } else {
                    nextComponent = "subcomponent";
                }
            }
        }else if(idArray.length == 7) {
            previousComponent = "subsubcomponent";


            let idSubsubcomponent = idArray[6];
            let idSubcomponent = idArray[4];
            let idComponent = idArray[2];
            let component = workshop.components.find((component: any) => component.order == idComponent);
            let subcomponent = component.subcomponents.find((subcomponent: any) => subcomponent.order == idSubcomponent);

            if(!subcomponent) return [0, 0, 0];

            // if the current subsubcomponent is the last one, then the next component is a subcomponent or a component
            if(subcomponent.subsubcomponents.length > 0 && subcomponent.subsubcomponents[subcomponent.subsubcomponents.length - 1].order == idSubsubcomponent) {
                // if the current subcomponent is the last one, then the next component is a component
                if(component.subcomponents.length > 0 && component.subcomponents[component.subcomponents.length - 1].order == idSubcomponent) {
                    nextComponent = "component";
                } else {
                    nextComponent = "subcomponent";
                }
            } else {
                nextComponent = "subsubcomponent";
            }
        }

        // if next component is a component and the component doesnot exist then rename to bottom
        if(nextComponent == "component" && workshop.components.find((component: any) => component.order == idArray[2] + 1) == undefined) {
            nextComponent = "bottom";
        }

        // return the allowed dropzones

        if((previousComponent == "component" && nextComponent == "component") || (previousComponent == "component" && nextComponent == "bottom")) {
            return [1, 1, 0];
        }

        if(previousComponent == "component" && nextComponent == "subcomponent") {
            return [0, 1, 0];
        }

        if((previousComponent == "subcomponent" && nextComponent == "subcomponent") || (previousComponent == "subsubcomponent" && nextComponent == "subcomponent")) {
            return [0, 1, 1];
        }

        if((previousComponent == "subsubcomponent" && nextComponent == "subsubcomponent") || (previousComponent == "subcomponent" && nextComponent == "subsubcomponent")) {
            return [0, 0, 1];
        }

        if((previousComponent == "subsubcomponent" && nextComponent == "component") || (previousComponent == "subsubcomponent" && nextComponent == "bottom") || (previousComponent == "subcomponent" && nextComponent == "bottom") || (previousComponent == "subcomponent" && nextComponent == "component")) {
            return [1, 1, 1];
        }

        return [0, 0, 0];
    }

    function componentIds(){
        // id is composed as follow : "drop-component-[component-id]-subcomponent-[subcomponent-id]-subsubcomponent-[subsubcomponent-id]" or "top" or only "drop-component-[component-id]" or "drop-component-[component-id]-subcomponent-[subcomponent-id]"
        // extract the component id from the id
        let idArray = id.split("-");

        if (id == "top") {
            return [];
        }

        if(idArray.length == 3) {
            return [idArray[2]];
        }

        if(idArray.length == 5) {
            return [idArray[2], idArray[4]];
        }

        if(idArray.length == 7) {
            return [idArray[2], idArray[4], idArray[6]];
        }

        return [];
    }

    return (
        <div key={id} id={id} onDrop={drop} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} className={"relative  transition-all ease-in-out duration-100 flex justify-center items-center w-full " + (h ? h : "h-4")}>
            <div className="w-full h-0.5 mx-1 bg-gray-900 rounded-lg opacity-0 transition-all ease-in-out duration-100 pointer-events-none"></div>
            <div className="absolute flex w-full h-full pointer-events-none zones">
                <div className="flex w-1/5 h-full"></div>
                <div className="flex w-1/5 h-full"></div>
                <div className="flex w-3/5 h-full"></div>
            </div>
            {/* <div className="absolute flex w-full h-full pointer-events-none zones">
                <p>{ allowed.toString()}</p>
            </div> */}
        </div>
    );
}