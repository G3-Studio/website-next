'use client';
import { TextParser } from '@/lib/text-parser';
import WorkshopEditComponentContainer from '../WorkshopEditComponentContainer';
import WorkshopTextInput from '../inputs/WorkshopTextInput';

export default function WorkshopSubtitle({ id, data, onclick }: { id: string; data: any; onclick?: any }) {
  return (
    <p
      key={id}
      id={id}
      onClick={onclick}
      className={(onclick ? 'cursor-pointer ' : '') + 'p-1 ws-subtitle'}
      dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
  );
}

export function WorkshopSubtitleEdit({ id, data, events }: { id: string; data: any; events: any }) {
  return (
    <WorkshopEditComponentContainer
      id={id}
      name="Sous-titre"
      ondelete={events && events[1]}
      ondrag={events && events[2]}>
      <WorkshopTextInput
        id={id + '-text'}
        title="Texte"
        placeholder="Sous-Section"
        value={data}
        data={data.text}
        dataField="text"
        events={events}
      />
    </WorkshopEditComponentContainer>
  );
}

export function WorkshopSubtitleDefaultData() {
  return {
    text: 'Sous-titre',
  };
}
