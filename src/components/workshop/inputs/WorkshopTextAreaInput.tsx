export default function WorkshopTextAreaInput({
  id,
  title,
  placeholder,
  value,
  data,
  dataField,
  events,
}: {
  id: string;
  title: string;
  placeholder: string;
  value: any;
  data: string;
  dataField: string;
  events?: any;
}) {
  function handleTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
      target.selectionStart = target.selectionEnd = start + 1;
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLTextAreaElement;

    let send = {
      ...value,
      [dataField]: target.value,
    };

    events && events[0](id, send);
  }

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-500">
        {title}
      </label>
      <textarea
        onKeyDown={handleTab}
        key={id}
        onChange={handleChange}
        defaultValue={data}
        name={id}
        id={id}
        data-field={dataField}
        className="w-full h-24 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent"
        placeholder={placeholder}></textarea>
    </div>
  );
}
