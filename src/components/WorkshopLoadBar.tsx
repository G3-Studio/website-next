'use client';

import { useEffect } from "react";

export default function WorkshopLoadBar({ children }: { children: any }) {
    useEffect(() => {
        document.onscroll = function(){ 
            let pos = getVerticalScrollPercentage(document.body);
            let bar = document.querySelector('.progress-bar') as HTMLElement;
            if(bar){
                bar.style.width = pos + '%';
            }
        }
        
        function getVerticalScrollPercentage( elm: any ){
            var p = elm.parentNode
            return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight ) * 100
        }
    }, []);
  return (
    <>
      {children}
    </>
  );
}