'use client';
import { MouseEvent } from 'react';
import WorkshopEditComponentContainer from '../WorkshopEditComponentContainer';
import WorkshopTextAreaInput from '../inputs/WorkshopTextAreaInput';

export default function WorkshopCode({
  id,
  data,
  onclick,
}: {
  id: string;
  data: any;
  onclick?: (e: MouseEvent<Element>) => void;
}) {
  return (
    <pre key={id} id={id} onClick={onclick} className={(onclick ? 'cursor-pointer ' : '') + 'p-1 ws-code'}>
      <code className="language-cs">{data.code}</code>
    </pre>
  );
}

export function WorkshopCodeEdit({ id, data, events }: { id: string; data: any; events: any }) {
  return (
    <WorkshopEditComponentContainer id={id} name="Code" ondelete={events && events[1]} ondrag={events && events[2]}>
      <WorkshopTextAreaInput
        id={id + '-code'}
        value={data}
        title="Texte"
        placeholder="void test()"
        data={data.code}
        dataField="code"
        events={events}
      />
    </WorkshopEditComponentContainer>
  );
}

export function WorkshopCodeDefaultData() {
  return {
    code: 'static void test() {\n   // Code\n}',
  };
}
