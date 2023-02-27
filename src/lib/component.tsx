import WorkshopCode, { WorkshopCodeDefaultData, WorkshopCodeEdit } from "@/components/workshop/elements/WorkshopCode";
import WorkshopReminder, { WorkshopReminderDefaultData, WorkshopReminderEdit } from "@/components/workshop/elements/WorkshopReminder";
import WorkshopSubtitle, { WorkshopSubtitleDefaultData, WorkshopSubtitleEdit } from "@/components/workshop/elements/WorkshopSubtitle";
import WorkshopText, { WorkshopTextDefaultData, WorkshopTextEdit } from "@/components/workshop/elements/WorkshopText";
import WorkshopTitle, { WorkshopTitleDefaultData, WorkshopTitleEdit } from "@/components/workshop/elements/WorkshopTitle";
import WorkshopYourTurn, { WorkshopYourTurnDefaultData, WorkshopYourTurnEdit } from "@/components/workshop/elements/WorkshopYourTurn";
import React from "react";

export function listComponent(){
  return [
      {
          name: "title",
          short: "Ti",
          component: WorkshopTitle,
          defaultData: WorkshopTitleDefaultData,
          edit: WorkshopTitleEdit
      },
      {
          name: "subtitle",
          short: "St",
          component: WorkshopSubtitle,
          defaultData: WorkshopSubtitleDefaultData,
          edit: WorkshopSubtitleEdit
      },
      {
          name: "text",
          short: "Te",
          component: WorkshopText,
          defaultData: WorkshopTextDefaultData,
          edit: WorkshopTextEdit
      },
      {
          name: "reminder",
          short: "Re",
          component: WorkshopReminder,
          defaultData: WorkshopReminderDefaultData,
          edit: WorkshopReminderEdit
      },
      {
          name: "yourturn",
          short: "Yt",
          component: WorkshopYourTurn,
          defaultData: WorkshopYourTurnDefaultData,
          edit: WorkshopYourTurnEdit
      },
      {
          name: "code",
          short: "Cd",
          component: WorkshopCode,
          defaultData: WorkshopCodeDefaultData,
          edit: WorkshopCodeEdit
      }
  ]
}

export function getComponent(state: any, key: any){
    // key from components-1-subcomponents-2 to array
    let keyArray = key.split("-");
  
    // get the component to move
    let component = JSON.parse(JSON.stringify(state));
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

export function chooseComponent(component: any, id: string, onclick? : any) : JSX.Element {
    let foundComponent = listComponent().find((obj: any) => obj.name === component.type);

    if(!foundComponent) {
      return <React.Fragment key={id}></React.Fragment>
    }

    return <foundComponent.component key={id} id={id} data={JSON.parse(component.data)} onclick={onclick} />;
}


export function chooseComponentEdit(component: any, id: string, events: any): JSX.Element {
    let foundComponent = listComponent().find((obj: any) => obj.name === component.type);

    if(!foundComponent) {
      return <React.Fragment key={id}></React.Fragment>
    }

    return <foundComponent.edit id={id} data={JSON.parse(component.data)} events={events} />;
}
  
export function chooseComponentDefaultData(type: any) {
    let foundComponent = listComponent().find((obj: any) => obj.name === type);
    if(!foundComponent) {
      return {};
    }

    return foundComponent.defaultData();
}