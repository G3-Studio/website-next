export default function WorkshopImageInput({ id, title, data, dataField, events }: { id: string; title: string; data: string; dataField: string; events?: any }) {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    try {
      let formData = new FormData();
      formData.append("media", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resJSON = await res.json();

      if (resJSON.url.length == 0) {
        alert("Sorry! something went wrong.");
        return;
      }

      console.log("File was uploaded successfylly:", resJSON.url);

      let value = { [dataField]: resJSON.url[0] };
      events && events[0](id, value);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* <label htmlFor={id} className="text-sm font-medium text-gray-500">
        {title}
      </label> */}
      <input type={"file"} accept="image/*" key={id} onChange={handleUpload} name={id} id={id} data-field={dataField} className="w-full h-24 px-3 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-official-yellow focus:border-transparent" />
    </div>
  );
}
