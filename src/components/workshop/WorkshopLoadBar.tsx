'use client';

import { ReactNode, useEffect } from 'react';

export default function WorkshopLoadBar({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.onscroll = function () {
      let pos = getVerticalScrollPercentage(document.body);
      let bar = document.querySelector('.progress-bar') as HTMLElement;
      if (bar) {
        bar.style.width = pos + '%';
      }
    };

    function getVerticalScrollPercentage(elm: HTMLElement) {
      let p = elm.parentNode as HTMLElement;
      if (!p) return 0;
      return ((elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight)) * 100;
    }
  }, []);
  return <>{children}</>;
}
