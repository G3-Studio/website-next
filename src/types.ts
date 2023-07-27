import { ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

export interface Workshop {
  id: number;
  title: string;
  components: Component[];
}

interface ComponentBase {
  id: string;
  order: number;
  type: string;
  data: string;
}

export interface Component extends ComponentBase {
  workshopId: number;
  subcomponents: Subcomponent[];
}

export interface Subcomponent extends ComponentBase {
  componentId: string;
  subsubcomponents: Subsubcomponent[];
}

export interface Subsubcomponent extends ComponentBase {
  subcomponentId: string;
}

export interface ComponentTypeFromList {
  name: string;
  short: string;
  component: () => ReactNode;
  defaultData: () => any;
  edit: () => ReactNode;
}

export enum ComponentType {
  Component,
  Subcomponent,
  Subsubcomponent,
}

export type ComponentTypes = Component | Subcomponent | Subsubcomponent;
