'use client';
import { TextParser } from '@/lib/text-parser';
import WorkshopEditComponentContainer from '../WorkshopEditComponentContainer';
import WorkshopTextInput from '../inputs/WorkshopTextInput';

export default function WorkshopList({ id, data, onclick }: { id: string; data: any; onclick?: any }) {
  return (
    <div
      key={id}
      id={id}
      onClick={onclick}
      className={(onclick ? 'cursor-pointer ' : '') + 'p-1 ws-list flex flex-col'}>
      {data.items.map((item: any, index: number) => {
        return (
          <div
            key={id + '-item' + index.toString()}
            id={id + '-item' + index.toString()}
            className="flex items-center gap-4">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div dangerouslySetInnerHTML={{ __html: new TextParser(item).parse() }}></div>
          </div>
        );
      })}
    </div>
  );
}

export function WorkshopListEdit({ id, data, events }: { id: string; data: any; events: any }) {
  function onAdd() {
    events &&
      events[0](id + '-item', {
        ...data,
        items: [...data.items, 'Item'],
      });
  }

  function onDeleteItem(e: any) {
    // get element dataset index
    const index = e.currentTarget.dataset.index;

    console.log(index);

    // remove item from array
    let value = {
      ...data,
      items: data.items.filter((item: any, i: number) => i != index),
    };

    // remove item from array
    events && events[0](id + '-item', value);
  }

  return (
    <WorkshopEditComponentContainer
      id={id}
      name="List"
      onadd={onAdd}
      ondelete={events && events[1]}
      ondrag={events && events[2]}>
      {data.items.map((item: any, index: number) => {
        return (
          <div key={id + '-item' + index.toString()} className="flex gap-2">
            <button className="px-3 my-2 text-white bg-red-500 rounded-md" data-index={index} onClick={onDeleteItem}>
              X
            </button>
            <WorkshopTextInput
              id={id + '-item' + index.toString()}
              list={index}
              title={'Element ' + (index + 1).toString()}
              value={data}
              placeholder="Ceci est un element"
              data={item}
              dataField="items"
              events={events}
            />
          </div>
        );
      })}
    </WorkshopEditComponentContainer>
  );
}

export function WorkshopListDefaultData() {
  return {
    items: ['Feu', 'Eau', 'Air', 'Terre'],
  };
}
