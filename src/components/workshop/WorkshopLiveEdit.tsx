"use client";
import { useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import LoadingLogo from "../LoadingLogo";
import WorkshopDropZone from "./WorkshopDropZone";
import WorkshopEditInput from "./inputs/WorkshopTextInput";
import WorkshopRenderer from "./WorkshopRenderer";
import { getComponent, chooseComponentEdit, chooseComponentDefaultData, listComponent } from "@/lib/component";
import Prism from "prismjs";
import "prismjs/components/prism-csharp";

// TODO: add export to pdf

let socket: any;

function reducer(state: any, action: any) {
  switch (action.type) {
    case "add":
      return addComponent(state, action.key, action.value);
    case "modify":
      return modifyWorkshop(state, action.key, action.value);
    case "set":
      return action.workshop;
    case "reorder":
      return reorder(state);
    case "delete":
      return deleteComponent(state, action.key);
    case "move":
      return moveComponent(state, action.key, action.position, action.component);
    default:
      return state;
  }
}

function reorder(state: any) {
  // reorder components, subcomponents and subsubcomponents using order property in the object
  // get components
  let components = state.components;

  // sort components
  components.sort((a: any, b: any) => a.order - b.order);

  // sort subcomponents and subsubcomponents
  components.forEach((component: any) => {
    if (component.subcomponents) {
      component.subcomponents.sort((a: any, b: any) => a.order - b.order);
      component.subcomponents.forEach((subcomponent: any) => {
        if (subcomponent.subcomponents) {
          subcomponent.subcomponents.sort((a: any, b: any) => a.order - b.order);
        }
      });
    }
  });

  return state;
}

function modifyWorkshop(state: any, key: string, value: any) {
  // key from components.1.subcomponents.2.data to array
  let keyArray = key.split("-");

  // do not mutate the state in order for react to detect the change
  let newState = JSON.parse(JSON.stringify(state));

  // get the data and replace the value in the state
  let data = newState;
  for (let i = 0; i < keyArray.length; i++) {
    if (i === keyArray.length - 1) {
      data[keyArray[i]] = JSON.stringify({
        ...JSON.parse(data[keyArray[i]]),
        ...value
      });
    } else {
      // if keyArray[i] can be parsed as int then search in the array the object id
      if (!isNaN(parseInt(keyArray[i]))) {
        data = data.find((obj: any) => obj.order === parseInt(keyArray[i]));
      } else {
        data = data[keyArray[i]];
      }
    }
  }

  return newState;
}

function addComponent(state: any, key: string, value: any) {
  // key from components-1-subcomponents-2 to array
  let keyArray = key.split("-");

  // do not mutate the state in order for react to detect the change
  let newState = JSON.parse(JSON.stringify(state));

  // get the data and replace the value in the state
  let data = newState;
  for (let i = 0; i < keyArray.length; i++) {
    if (i === keyArray.length - 1) {
      // add at value.order position
      data[keyArray[i]].splice(value.order, 0, value);

      // add 1 to all the order after the new component
      for (let j = value.order + 1; j < data[keyArray[i]].length; j++) {
        data[keyArray[i]][j].order = j;
      }
    } else {
      // if keyArray[i] can be parsed as int then search in the array the object id
      if (!isNaN(parseInt(keyArray[i]))) {
        data = data.find((obj: any) => obj.order === parseInt(keyArray[i]));
      } else {
        data = data[keyArray[i]];
      }
    }
  }

  return newState;
}

function deleteComponent(state: any, key: any, noReorder?: boolean) {

  // key from components.1.subcomponents.2 to array
  let keyArray = key.split("-");

  // do not mutate the state in order for react to detect the change
  let newState = JSON.parse(JSON.stringify(state));

  // get the data and replace the value in the state
  let data = newState;
  for (let i = 0; i < keyArray.length; i++) {
    if (i === keyArray.length - 1) {
      if (!isNaN(parseInt(keyArray[i]))) {
        // get the index of the object to delete
        let index = data.findIndex((obj: any) => obj.order === parseInt(keyArray[i]));

        if(index === -1) return state;
        data.splice(index, 1);

        if(!noReorder) {
          // remove 1 to all the order after the deleted component
          for (let j = index; j < data.length; j++) {
            data[j].order = j;
          }
        }
      } else {
        delete data[keyArray[i]];
      }
    } else {
      // if keyArray[i] can be parsed as int then search in the array the object id
      if (!isNaN(parseInt(keyArray[i]))) {
        data = data.find((obj: any) => obj.order === parseInt(keyArray[i]));
      } else {
        data = data[keyArray[i]];
      }
    }
  }
  
  return newState;
}

function moveComponent(state: any, key: any, position: any, component: any) {
  // do not mutate the state in order for react to detect the change
  let newState = JSON.parse(JSON.stringify(state));

  // delete the component from the old position
  newState = deleteComponent(newState, key, true);

  // add the component to the new position
  newState = addComponent(newState, position, component);

  // reorder the components
  let keyArray = key.split("-");

  // get the data and replace the value in the state
  let data = newState;
  for (let i = 0; i < keyArray.length; i++) {
    if (i === keyArray.length - 1) {
      if (!isNaN(parseInt(keyArray[i]))) {
        // get the index of the object to delete
        let index = data.findIndex((obj: any) => obj.order === parseInt(keyArray[i]) + 1);

        if(index !== -1) {
          for (let j = index; j < data.length; j++) {
            data[j].order = j;
          }
        }
      }
    } else {
      // if keyArray[i] can be parsed as int then search in the array the object id
      if (!isNaN(parseInt(keyArray[i]))) {
        data = data.find((obj: any) => obj.order === parseInt(keyArray[i]));
      } else {
        data = data[keyArray[i]];
      }
    }
  }

  return newState;
}

export default function WorkshopLiveEdit({ workshop }: { workshop: any }) {
  const [editWorkshop, dispatch] = useReducer(reducer, workshop);
  const [selected, setSelected] = useState("");
  // connected flag
  const [connected, setConnected] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [noConnectionText, setNoConnectionText] = useState<string>("Connecting to server");

  // add language to prism language list
  console.log(Prism.languages);

  useEffect(() => (() => { socketInitializer() })() , []);

  useEffect(() => {
    // remove all edit-selected classes
    let elements = document.querySelectorAll(".edit-selected");
    elements.forEach((element) => {
      element.classList.remove("edit-selected");
    });

    if (selected && selected !== "") {
      let element = document.querySelector("#" + selected);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        element.classList.add("edit-selected");
      }
    }

    setTimeout(() => {
      setSelected("");
    }, 2000);
  }, [selected]);

  useEffect(() => {
    Prism.highlightAll();
  }, [editWorkshop]);


  useEffect(() => {
    setNoConnectionText("Disconnected from server");
    // if(isInit) {
    //   setConnected(false);
    //   setTimeout(() => {
    //     setTimeout(() => {
    //       setNoConnectionText("Ca charge toujours");
    //       setTimeout(() => {
    //         setNoConnectionText("T'as vu il est beau le chargement hein ?");
    //         setTimeout(() => {
    //           setNoConnectionText("Dis-le qu'il est beau ou sinon je te libère pas !");
    //           setTimeout(() => {
    //             setNoConnectionText("Merci beaucoup pour ton compliment il me fait chaud au coeur !");
    //             setTimeout(() => {
    //               setConnected(true);
    //               setNoConnectionText("Disconnected from server");
    //             }, 3000);
    //           }, 3000);
    //         }, 3000);
    //       }, 3000);
    //     }, 3000);
    //   }, 3000);
    // }
  }, [isInit])

  async function socketInitializer() {
    // create socket
    await fetch("/api/socket");
    socket = io();

    // on connect
    socket.on("connect", () => {
      // set connected flag
      setConnected(true);

      if(!isInit) setIsInit(true);

      // join the workshop
      socket.emit("join-workshop", workshop.id);
    });

    // on disconnect
    socket.on("disconnect", () => {
      // set connected flag
      setConnected(false);
    });

    // on error
    socket.on("error", (error: any) => {
      console.log(error);
    });

    // on deleted component
    socket.on("workshop-delete", (data: any) => {
      // update the workshop
      dispatch({ type: "delete", key: data.key });
    });

    // on workshop update
    socket.on("workshop-modify", (data: any) => {
      // update the workshop
      dispatch({ type: "modify", key: data.key, value: data.value });
    });

    // on workshop update
    socket.on("workshop-add", (data: any) => {
      // update the workshop
      dispatch({ type: "add", key: data.key, value: data.value });
    });

    // on workshop update
    socket.on("workshop-move", (data: any) => {
      // update the workshop
      dispatch({ type: "move", key: data.key, position: data.position, component: data.component});
    });
  };

  function handleWorkshopChange(e: Event) {
    // get the input element
    let input = e.target as HTMLInputElement;

    // get the id of the input element
    let idList = input.id.split("-");
    let id = idList.slice(0, idList.length - 1).join("-") + "-data";

    // test if data-field is set
    if (input.dataset.field) {
      // get the data-field value
      let dataField = input.dataset.field;
      let value = { [dataField]: input.value };
      
      // dispatch the modify action
      // dispatch({ type: "modify", key: id, value: value });

      // send to websocket to update the dataidentifier and the other clients
      socket.emit("workshop-modify-send", { roomId: workshop.id, key: id, value: value });
    }
  }

  function handleClickRendererSelection(e: Event) {
    // get the input element
    let input = e.target as HTMLInputElement;

    // get the id of the input element
    let idList = input.id.split("-");
    let id = idList.slice(1, idList.length).join("-");

    setSelected(id);
  }

  function deleteComponent(e: Event) {
    let element = e.target as HTMLElement;
    // remove the -delete suffix
    let id = element.id.substring(0, element.id.length - 7);

    // send to websocket to update the dataidentifier and the other clients
    socket.emit("workshop-delete-send", { roomId: workshop.id, key: id });
  }

  function toolsDragStart(e: React.DragEvent<HTMLDivElement>) {
    let element = e.target as HTMLElement;
    e.dataTransfer.setData("type", element.dataset.type ? element.dataset.type : "");
    e.dataTransfer.setData("mode", "create");
    e.dataTransfer.effectAllowed = "copy";
    // remove ghost
    let dragImage = document.createElement("div");
    dragImage.style.visibility = "hidden";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  }

  function elementDragStart(e: React.DragEvent<HTMLDivElement>) {
    let element = e.target as HTMLElement;
    
    e.dataTransfer.setData("type", element.id);
    e.dataTransfer.setData("mode", "move");
    // add data clearly to the dataTransfer object to use during DragEnter
    e.dataTransfer.setData("move", "");
    e.dataTransfer.setData(element.id, "");
    e.dataTransfer.effectAllowed = "move";
    // remove ghost
    let dragImage = document.createElement("div");
    dragImage.style.visibility = "hidden";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  }

  function drop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    let target = e.target as HTMLElement;
    target.classList.remove("h-8");

    if(target.children[0]) {
      target.children[0].classList.add("opacity-0");
    }

    // get the data
    let type = e.dataTransfer.getData("type");
    let mode = e.dataTransfer.getData("mode");
    let dropZone = parseInt(target.dataset.dropZone ? target.dataset.dropZone : "0");
    let componentIds = target.dataset.componentIds ? target.dataset.componentIds.split(",") : [];

    let key;
    let order;
    let object;
    let component = getComponent(editWorkshop, type);
    if(dropZone == 0) {
      key = "components";
      order = componentIds[0] ? parseInt(componentIds[0]) + 1 : 0;
      object = {
        subcomponents: []
      }

      if (mode == "move") {
        // get old position ("component", "subcomponent", "subsubcomponent") using type
        let oldPosition = type.split("-").length;
        
        // if old position is a subcomponent
        if (oldPosition == 4) {
          // rename subsubcomponents array to subcomponents
          component.subcomponents = component.subsubcomponents;
          delete component.subsubcomponents;

          // add subsubcomponents array to each subcomponent
          component.subcomponents.forEach((subcomponent: any) => {
            subcomponent.subsubcomponents = [];
          })
        }
      }
    }else if (dropZone == 1) {
      key = "components-" + componentIds[0] + "-subcomponents";
      order = componentIds[1] ? parseInt(componentIds[1]) + 1 : 0;
      object = {
        subsubcomponents: []
      }
      
      if (mode == "move") {
        // get old position ("component", "subcomponent", "subsubcomponent")
        let oldPosition = type.split("-").length;

        // if old position is a component
        if (oldPosition == 2) {
          // rename subcomponents array to subsubcomponents
          component.subsubcomponents = component.subcomponents;
          delete component.subcomponents;
        }
      }
    }else if (dropZone == 2) {
      key = "components-" + componentIds[0] + "-subcomponents-" + componentIds[1] + "-subsubcomponents";
      order = componentIds[2] ? parseInt(componentIds[2]) + 1 : 0;
      object = {}
    }

    if (mode == "create") {
      // create a new component
      let newComponent = {
        id: uuidv4(),
        order: order,
        type: type,
        data: JSON.stringify(chooseComponentDefaultData(type)),
        ...object
      };
      
      // dispatch({ type: "add", key: key, value: newComponent });

      // send to websocket to update the dataidentifier and the other clients
      socket.emit("workshop-add-send", { roomId: workshop.id, key: key, value: newComponent });
    } else {
      component.order = order;

      // dispatch the add action
      // dispatch({ type: "move", key: type, position: key, component: component });

      // send to websocket to update the dataidentifier and the other clients
      socket.emit("workshop-move-send", { roomId: workshop.id, key: type, position: key, component: component });
    }
  }

  return (
    <>
      {!connected ? <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen bg-gray-900 bg-opacity-75">
        <LoadingLogo stroke="#FB8042" fill="none" />
        <p className="font-sans text-lg text-white bold">{noConnectionText}</p>
      </div> : <></>}
    
      <div className="relative w-12">
        <div className="fixed left-0 flex flex-col items-center w-12 h-screen gap-4 px-1 py-2 bg-gray-600">
          {listComponent().map((component: any, index: number) => {
            return (
              <div key={index} onDragStart={toolsDragStart} data-type={component.name} className="flex items-center justify-center font-bold text-white bg-gray-900 rounded-lg cursor-pointer w-9 h-9" draggable>{component.short}</div>
            );
          })}
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col w-1/2 p-5">
          <WorkshopEditInput id="title" title="Nom du Workshop" placeholder="Feature 1, Feature 2" data={editWorkshop?.title} events={[handleWorkshopChange]} />
          <WorkshopDropZone id={'drop'} h={"h-6"} workshop={editWorkshop} drop={drop} />
          {editWorkshop.components.map((component: any) => {
            let identifier = "components-" + component.order;
            return (
              <div key={"component" + component.order} className="flex flex-col">
                {chooseComponentEdit(component, identifier, [handleWorkshopChange, deleteComponent, elementDragStart])}
                <WorkshopDropZone id={'drop-' + identifier} workshop={editWorkshop} drop={drop} />
                {component.subcomponents.map((subcomponent: any) => {
                  identifier = "components-" + component.order + "-subcomponents-" + subcomponent.order;
                  return (
                    <div key={"subcomponents" + subcomponent.order} className="flex flex-col">
                      <div className="flex ml-12">
                        {chooseComponentEdit(subcomponent, identifier, [handleWorkshopChange, deleteComponent, elementDragStart])}
                      </div>
                      <WorkshopDropZone id={'drop-' + identifier} workshop={editWorkshop} drop={drop} />
                      {subcomponent.subsubcomponents.map((subsubcomponent: any) => {
                        identifier = "components-" + component.order + "-subcomponents-" + subcomponent.order + "-subsubcomponents-" + subsubcomponent.order;
                        return (
                          <div key={"subsubcomponents" + subsubcomponent.order} className="flex flex-col">
                            <div className="flex ml-24">
                              {chooseComponentEdit(subsubcomponent, identifier, [handleWorkshopChange, deleteComponent, elementDragStart])}
                            </div>
                            <WorkshopDropZone id={'drop-' + identifier} workshop={editWorkshop} drop={drop}/>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-1/2 h-full p-5 bg-white">
          <WorkshopRenderer workshop={editWorkshop} onclick={handleClickRendererSelection} />
        </div>
      </div>
    </>
  );
}
