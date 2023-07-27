import WorkshopCode, { WorkshopCodeDefaultData, WorkshopCodeEdit } from '@/components/workshop/elements/WorkshopCode';
import WorkshopCommonMistake, {
  WorkshopCommonMistakeDefaultData,
  WorkshopCommonMistakeEdit,
} from '@/components/workshop/elements/WorkshopCommonMistake';
import WorkshopImage, {
  WorkshopImageDefaultData,
  WorkshopImageEdit,
} from '@/components/workshop/elements/WorkshopImage';
import WorkshopList, { WorkshopListDefaultData, WorkshopListEdit } from '@/components/workshop/elements/WorkshopList';
import WorkshopReminder, {
  WorkshopReminderDefaultData,
  WorkshopReminderEdit,
} from '@/components/workshop/elements/WorkshopReminder';
import WorkshopSubtitle, {
  WorkshopSubtitleDefaultData,
  WorkshopSubtitleEdit,
} from '@/components/workshop/elements/WorkshopSubtitle';
import WorkshopText, { WorkshopTextDefaultData, WorkshopTextEdit } from '@/components/workshop/elements/WorkshopText';
import WorkshopTheSmallPlus, {
  WorkshopTheSmallPlusDefaultData,
  WorkshopTheSmallPlusEdit,
} from '@/components/workshop/elements/WorkshopTheSmallPlus';
import WorkshopTitle, {
  WorkshopTitleDefaultData,
  WorkshopTitleEdit,
} from '@/components/workshop/elements/WorkshopTitle';
import WorkshopToGoFurther, {
  WorkshopToGoFurtherDefaultData,
  WorkshopToGoFurtherEdit,
} from '@/components/workshop/elements/WorkshopToGoFurther';
import WorkshopYourTurn, {
  WorkshopYourTurnDefaultData,
  WorkshopYourTurnEdit,
} from '@/components/workshop/elements/WorkshopYourTurn';
import { ComponentTypeFromList, ComponentTypes } from '@/types';
import React, { MouseEvent } from 'react';

export function listComponent() {
  return [
    {
      name: 'title',
      short: 'Ti',
      component: WorkshopTitle,
      defaultData: WorkshopTitleDefaultData,
      edit: WorkshopTitleEdit,
    },
    {
      name: 'subtitle',
      short: 'St',
      component: WorkshopSubtitle,
      defaultData: WorkshopSubtitleDefaultData,
      edit: WorkshopSubtitleEdit,
    },
    {
      name: 'text',
      short: 'Te',
      component: WorkshopText,
      defaultData: WorkshopTextDefaultData,
      edit: WorkshopTextEdit,
    },
    {
      name: 'reminder',
      short: 'Re',
      component: WorkshopReminder,
      defaultData: WorkshopReminderDefaultData,
      edit: WorkshopReminderEdit,
    },
    {
      name: 'yourturn',
      short: 'Yt',
      component: WorkshopYourTurn,
      defaultData: WorkshopYourTurnDefaultData,
      edit: WorkshopYourTurnEdit,
    },
    {
      name: 'code',
      short: 'Cd',
      component: WorkshopCode,
      defaultData: WorkshopCodeDefaultData,
      edit: WorkshopCodeEdit,
    },
    {
      name: 'image',
      short: 'Ig',
      component: WorkshopImage,
      defaultData: WorkshopImageDefaultData,
      edit: WorkshopImageEdit,
    },
    {
      name: 'commonmistake',
      short: 'Cm',
      component: WorkshopCommonMistake,
      defaultData: WorkshopCommonMistakeDefaultData,
      edit: WorkshopCommonMistakeEdit,
    },
    {
      name: 'thesmallplus',
      short: 'Sp',
      component: WorkshopTheSmallPlus,
      defaultData: WorkshopTheSmallPlusDefaultData,
      edit: WorkshopTheSmallPlusEdit,
    },
    {
      name: 'togofurther',
      short: 'Gf',
      component: WorkshopToGoFurther,
      defaultData: WorkshopToGoFurtherDefaultData,
      edit: WorkshopToGoFurtherEdit,
    },
    {
      name: 'list',
      short: 'Li',
      component: WorkshopList,
      defaultData: WorkshopListDefaultData,
      edit: WorkshopListEdit,
    },
  ] as ComponentTypeFromList[];
}

export function getComponent(state: any, key: string) {
  // key from components-1-subcomponents-2 to array
  let keyArray = key.split('-');

  // get the component to move
  let component = JSON.parse(JSON.stringify(state));
  for (let i = 0; i < keyArray.length; i++) {
    // if keyArray[i] can be parsed as int then search in the array the object id
    if (!isNaN(parseInt(keyArray[i]))) {
      component = component.find((obj: ComponentTypes) => obj.order === parseInt(keyArray[i]));
    } else {
      component = component[keyArray[i]];
    }
  }

  return component;
}

export function chooseComponent(
  component: ComponentTypes,
  id: string,
  onclick?: (e: MouseEvent<Element>) => void,
): JSX.Element {
  let foundComponent = listComponent().find((obj: ComponentTypeFromList) => obj.name === component.type);

  if (!foundComponent) {
    return <React.Fragment key={id}></React.Fragment>;
  }

  const Component: any = foundComponent.component;

  return <Component key={id} id={id} data={JSON.parse(component.data)} onclick={onclick} />;
}

export function chooseComponentEdit(component: ComponentTypes, id: string, events: any): JSX.Element {
  let foundComponent = listComponent().find((obj: ComponentTypeFromList) => obj.name === component.type);

  if (!foundComponent) {
    return <React.Fragment key={id}></React.Fragment>;
  }

  const EditComponent: any = foundComponent.edit;

  return <EditComponent id={id} data={JSON.parse(component.data)} events={events} />;
}

export function chooseComponentDefaultData(type: string) {
  let foundComponent = listComponent().find((obj: ComponentTypeFromList) => obj.name === type);
  if (!foundComponent) {
    return {};
  }

  return foundComponent.defaultData();
}
