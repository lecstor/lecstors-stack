/* eslint-disable no-nested-ternary */
import * as React from "react";

// type Props = {
//   title?: string;
// } & React.SVGProps<SVGSVGElement>;

// https://danielmilner.com/adding-drop-shadows-to-svgs/
export const DropShadowSvgFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute", left: 0, top: 0 }}>
    <filter id="drop-shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0" />
      <feOffset dx="1" dy="1" result="offsetblur" />
      <feFlood floodColor="rgb(0,0,0)" floodOpacity="0.3" />
      <feComposite in2="offsetblur" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </svg>
);
