import { TextParser } from '@/lib/textParser'

export default function WorkshopText({ id, data }: { id: number, data: any }) {
    return (
        <p key={id} className="ws-text" dangerouslySetInnerHTML={{ __html: new TextParser(data.text).parse() }}></p>
    );
}

export function WorkshopTextEdit(){

}