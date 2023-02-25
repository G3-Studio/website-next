"use client";
import { Component, useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import LoadingLogo from "./LoadingLogo";
import { WorkshopTextEdit } from "./workshop/WorkshopText";
import { WorkshopTitleEdit } from "./workshop/WorkshopTitle";
import WorkshopDropZone from "./WorkshopDropZone";
import WorkshopEditInput from "./WorkshopEditInput";
import WorkshopRenderer from "./WorkshopRenderer";

// TODO: add export to pdf
// TODO: add a way to reorder a component

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
      return moveComponent(state, action.key, action.position, action.order, action.component);
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
      data[keyArray[i]] = value;
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
  // key from components.1.subcomponents.2.data to array
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

function deleteComponent(state: any, key: any) {

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

        // remove 1 to all the order after the deleted component
        for (let j = index; j < data.length; j++) {
          data[j].order = j;
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
  newState = deleteComponent(newState, key);

  // add the component to the new position
  newState = addComponent(newState, position, component);

  return newState;
}

function chooseComponent(component: any, id: string, events: any): JSX.Element {
  switch (component.type) {
    case "title":
      return <WorkshopTitleEdit id={id} data={JSON.parse(component.data)} events={events} />;
    case "text":
      return <WorkshopTextEdit id={id} data={JSON.parse(component.data)} events={events} />;
    default:
      return <></>;
  }
}

export default function WorkshopLiveEdit({ workshop }: { workshop: any }) {
  const [editWorkshop, dispatch] = useReducer(reducer, workshop);
  const [selected, setSelected] = useState("");
  // connected flag
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => (() => { socketInitializer() })() , []);

  useEffect(() => {
    // remove all edit-selected classes
    let elements = document.querySelectorAll(".edit-selected");
    elements.forEach((element) => {
      element.classList.remove("edit-selected");
    });

    if (selected && selected !== "") {
      let element = document.querySelector("#renderer-" + selected);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        element.classList.add("edit-selected");
      }
    }
  }, [selected]);

  async function socketInitializer() {
    // create socket
    await fetch("/api/socket");
    socket = io();

    // on connect
    socket.on("connect", () => {
      // set connected flag
      setConnected(true);

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
      console.log("add")
      // update the workshop
      dispatch({ type: "add", key: data.key, value: data.value });
    });

    // on workshop update
    socket.on("workshop-move", (data: any) => {
      // update the workshop
      dispatch({ type: "move", key: data.key, position: data.position, order: data.order, component: data.component});
    });
  };

  function handleWorkshopChange(e: Event) {
    // get the input element
    let input = e.target as HTMLInputElement;

    // get the id and value
    let id = input.id;

    // get the value
    let value = input.value;

    // TODO: hold multiple inputs in the same component

    // test if data-field is set
    if (input.dataset.field) {
      // get the data-field value
      let dataField = input.dataset.field;
      value = JSON.stringify({ [dataField]: value });
    }

    // dispatch the modify action
    dispatch({ type: "modify", key: id, value: value });

    // send to websocket to update the dataidentifier and the other clients
    socket.emit("workshop-modify-send", { roomId: workshop.id, key: id, value: value });
  }

  function hoverEnter(e: Event) {
    let element = e.target as HTMLElement;
    // remove the -data suffix
    let id = element.id.substring(0, element.id.length - 5);
    setSelected(id);
  }

  function hoverLeave(e: Event) {
    setSelected("");
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
  }

  function elementDragStart(e: React.DragEvent<HTMLDivElement>) {
    let element = e.target as HTMLElement;
    
    e.dataTransfer.setData("type", element.id);
    e.dataTransfer.setData("mode", "move");
    e.dataTransfer.effectAllowed = "move";
  }

  function getComponent(key: any){
      // key from components.1.subcomponents.2.data to array
    let keyArray = key.split("-");

    // get the component to move
    let component = JSON.parse(JSON.stringify(editWorkshop));
    for (let i = 0; i < keyArray.length; i++) {
      // if keyArray[i] can be parsed as int then search in the array the object id
      if (!isNaN(parseInt(keyArray[i]))) {
        component = component.find((obj: any) => obj.order === parseInt(keyArray[i]));
      } else {
        component = component[keyArray[i]];
      }
    }

    return component;
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
    let component = getComponent(type);
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
        data: JSON.stringify({ text: "New"}),
        ...object
      };
      
      // dispatch({ type: "add", key: key, value: newComponent });

      // send to websocket to update the dataidentifier and the other clients
      socket.emit("workshop-add-send", { roomId: workshop.id, key: key, value: newComponent });
    } else {
      // console.log("move", type, key, order, component);

      component.order = order;

      // dispatch the add action
      // dispatch({ type: "move", key: type, position: key, order: order, component: component });

      // send to websocket to update the dataidentifier and the other clients
      socket.emit("workshop-move-send", { roomId: workshop.id, key: type, position: key, order: order, component: component });
    }
  }

  return (
    <>
      {!connected ? <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen bg-gray-900 bg-opacity-75">
        <LoadingLogo stroke="#FB8042" fill="none" />
        <p className="font-sans text-lg text-white bold">Disconnected from server</p>
      </div> : <></>}
    
      <div className="relative w-12">
        <div className="fixed left-0 flex flex-col items-center justify-center w-12 h-screen gap-4 p-1 bg-gray-600">
          <div onDragStart={toolsDragStart} data-type="text" className="flex items-center justify-center font-bold text-white bg-gray-900 rounded-lg cursor-pointer w-9 h-9" draggable>Te</div>
          <div onDragStart={toolsDragStart} data-type="title" className="flex items-center justify-center font-bold text-white bg-gray-900 rounded-lg cursor-pointer w-9 h-9" draggable>Ti</div>
        </div>
      </div>
      <div className="flex w-full h-screen">
        <div className="flex flex-col w-1/2 p-5">
          <WorkshopEditInput id="title" title="Nom du Workshop" placeholder="Feature 1, Feature 2" data={editWorkshop?.title} events={[handleWorkshopChange, hoverEnter, hoverLeave]} />
          <WorkshopDropZone id={'drop'} h={"h-6"} workshop={editWorkshop} drop={drop} />
          {editWorkshop.components.map((component: any) => {
            let identifier = "components-" + component.order;
            return (
              <div key={"component" + component.order} className="flex flex-col">
                {chooseComponent(component, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent, elementDragStart])}
                <WorkshopDropZone id={'drop-' + identifier} workshop={editWorkshop} drop={drop} />
                {component.subcomponents.map((subcomponent: any) => {
                  identifier = "components-" + component.order + "-subcomponents-" + subcomponent.order;
                  return (
                    <div key={"subcomponents" + subcomponent.order} className="flex flex-col">
                      <div className="flex ml-12">
                        {chooseComponent(subcomponent, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent, elementDragStart])}
                      </div>
                      <WorkshopDropZone id={'drop-' + identifier} workshop={editWorkshop} drop={drop} />
                      {subcomponent.subsubcomponents.map((subsubcomponent: any) => {
                        identifier = "components-" + component.order + "-subcomponents-" + subcomponent.order + "-subsubcomponents-" + subsubcomponent.order;
                        return (
                          <div key={"subsubcomponents" + subsubcomponent.order} className="flex flex-col">
                            <div className="flex ml-24">
                              {chooseComponent(subsubcomponent, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent, elementDragStart])}
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
          <WorkshopRenderer workshop={editWorkshop} />
        </div>
      </div>
    </>
  );
}
