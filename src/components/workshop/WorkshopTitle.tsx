
export default function WorkshopTitle({ id, data }: { id: number, data: any }) {
    return (
        <p key={id} className="ws-title">{data.text}</p>
    );
}