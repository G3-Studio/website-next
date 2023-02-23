"use client";
import { useReducer } from "react";
import WorkshopEditInput from "./WorkshopEditInput";
import WorkshopRenderer from "./WorkshopRenderer";

export default function WorkshopLiveEdit({ workshop }: { workshop: any }) {
    function reducer(state: any , action: any ) {
        switch (action.type) {
            case 'set': return action.workshop;
            default: return state;
        }
    }
      
    const [editWorkshop, dispatch] = useReducer(reducer, workshop);

    function handleWorkshopChange(key: string, value: any) {
        // update workshop object

        // update workshop renderer
    }


    return (
        <>
            <div className="relative w-12">
                <div className="fixed left-0 flex flex-col items-center justify-center w-12 h-screen gap-2 p-1 bg-gray-600">
                    <div onClick={() => dispatch({ type: "set", workshop: { id: 1, title: 'NewTitle', components: [] }})} className="flex bg-red-600 rounded-lg w-9 h-9"></div>
                </div>
            </div>
            <div className="flex w-full h-screen">
                <div className="flex flex-col w-1/2 h-full gap-2 p-5 bg-white">
                    <WorkshopEditInput id="workshop.title" title="Nom du Workshop" placeholder="Feature 1, Feature 2" data={editWorkshop?.title} />

                    
                </div>
                <div className="flex flex-col w-1/2 h-full gap-2 p-5 bg-gray-600">
                    <WorkshopRenderer workshop={editWorkshop} />
                </div>
            </div>
            
        </>
    );
}