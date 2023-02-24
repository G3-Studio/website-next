"use client";
import { useEffect, useReducer, useState } from "react";
import { WorkshopTextEdit } from "./workshop/WorkshopText";
import { WorkshopTitleEdit } from "./workshop/WorkshopTitle";
import WorkshopEditInput from "./WorkshopEditInput";
import WorkshopRenderer from "./WorkshopRenderer";

// TODO: websocket to update workshop in real time
// TODO: add export to pdf

// TODO: add a way to add a component
// TODO: add a way to reorder a component
// TODO: add a way to delete a component


function reducer(state: any, action: any) {
  switch (action.type) {
    case "modify":
      return modifyWorkshop(state, action.key, action.value);
    case "set":
      return action.workshop;
    case "reorder":
      return reorder(state);
    case "delete":
      return deleteComponent(state, action.key);
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
        data = data.find((obj: any) => obj.id === parseInt(keyArray[i]));
      } else {
        data = data[keyArray[i]];
      }
    }
  }

  return newState;
}

function deleteComponent(state: any, key: any) {
  // key from components.1.subcomponents.2.data to array
  let keyArray = key.split("-");

  // do not mutate the state in order for react to detect the change
  let newState = JSON.parse(JSON.stringify(state));

  // get the data and replace the value in the state
  let data = newState;
  for (let i = 0; i < keyArray.length; i++) {
    // if keyArray[i] can be parsed as int then search in the array the object id
    if (!isNaN(parseInt(keyArray[i]))) {
      data = data.find((obj: any) => obj.id === parseInt(keyArray[i]));
    } else {
      data = data[keyArray[i]];
    }
    
    if (i === keyArray.length - 1) {
      // delete the component in newState
      let index = newState.components.findIndex((obj: any) => obj.id === data.id);
      newState.components.splice(index, 1);
      
    }
  }

  return newState;
}

// Test delete component
deleteComponent(
  {
    components: [
      {
        id: 1,
        type: "title",
        data: { title: "Titre 1" },
        subcomponents: [
          {
            id: 2,
            type: "text",
            data: { text: "Texte 1" },
            subsubcomponents: [
              {
                id: 3,
                type: "text",
                data: { text: "Texte 2" },
              },
            ],
          },
        ],
      },
    ],
  },
  "components-1-subcomponents-2"
)

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

    // update workshop object
    dispatch({ type: "modify", key: id, value: value });

    // TODO: send to websocket to update the dataidentifier and the other clients

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

    console.log(element.id);
    
    dispatch({ type: "delete", key: id });

    // TODO: send to websocket to update the dataidentifier and the other clients
  }

  return (
    <>
      <div className="relative w-12">
        <div className="fixed left-0 flex flex-col items-center justify-center w-12 h-screen gap-4 p-1 bg-gray-600">
          <div className="flex bg-gray-900 rounded-lg w-9 h-9"></div>
          <div className="flex bg-gray-900 rounded-lg w-9 h-9"></div>
          <div className="flex bg-gray-900 rounded-lg w-9 h-9"></div>
          <div className="flex bg-gray-900 rounded-lg w-9 h-9"></div>
          <div className="flex bg-gray-900 rounded-lg w-9 h-9"></div>
        </div>
      </div>
      <div className="flex w-full h-screen">
        <div className="flex flex-col w-1/2 gap-6 p-5">
          <WorkshopEditInput id="title" title="Nom du Workshop" placeholder="Feature 1, Feature 2" data={editWorkshop?.title} events={[handleWorkshopChange, hoverEnter, hoverLeave]} />

          {workshop.components.map((component: any) => {
            let identifier = "components-" + component.id;
            return (
              <div key={"component" + component.id} className="flex flex-col gap-4">
                {chooseComponent(component, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent])}

                {component.subcomponents.map((subcomponent: any) => {
                  identifier += "-subcomponents-" + subcomponent.id;
                  return (
                    <div key={"subcomponents" + subcomponent.id} className="flex flex-col gap-4 ml-12">
                      {chooseComponent(subcomponent, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent])}

                      {subcomponent.subsubcomponents.map((subsubcomponent: any) => {
                        identifier += "-subsubcomponents-" + subsubcomponent.id;
                        return (
                          <div key={"subsubcomponents" + subsubcomponent.id} className="flex flex-col gap-4 ml-12">
                            {chooseComponent(subsubcomponent, identifier, [handleWorkshopChange, hoverEnter, hoverLeave, deleteComponent])}
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
