"use client";
export default function WorkshopEditComponentContainer({ id, ondelete, ondrag, children }: { id: string, ondelete?: any, ondrag?: any, children: any }) {
  
    return (
      <div draggable onDragStart={ondrag} id={id} className="flex w-full gap-2 p-2 border-2 border-red-600 rounded-lg">
        {children}
        {ondelete && id && 
          <button id={id + "-delete"} onClick={ondelete} className="flex items-center justify-center px-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        }
      </div>
    );
  }