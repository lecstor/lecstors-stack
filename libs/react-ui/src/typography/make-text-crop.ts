// http://text-crop.eightshapes.com/?typeface-selection=google-font&typeface=Roboto&custom-typeface-name=Helvetica&custom-typeface-url=&custom-typeface-weight=400&custom-typeface-style=normal&weight-and-style=100&size=32&line-height=1.2&top-crop=6&bottom-crop=8
// https://github.com/LJEsp/study-text-crop

import { css } from "styled-components";

const makeTextCrop = ({
  fontFamily = "Roboto, sans-serif",
  topCrop = 6,
  bottomCrop = 8,
  cropFontSize = 32,
  cropLineHeight = 1.2
}) => ({
  lineHeight = cropLineHeight,
  topAdjustment = 0,
  bottomAdjustment = 0
} = {}) => {
  const dynamicTopCrop =
    (topCrop + (lineHeight - cropLineHeight) * (cropFontSize / 2)) /
    cropFontSize;

  const dynamicBottomCrop =
    (bottomCrop + (lineHeight - cropLineHeight) * (cropFontSize / 2)) /
    cropFontSize;

  const marginBottom = `-${dynamicTopCrop + topAdjustment}em`;
  const marginTop = `-${dynamicBottomCrop + bottomAdjustment}em`;

  return `
    font-family: ${fontFamily};
    line-height: ${lineHeight};
    &::before,
    &::after {
      content: "";
      display: block;
      height: 0;
      width: 0;
    }
    &::before {
      margin-bottom: ${marginBottom};
    }
    &::after {
      margin-top: ${marginTop};
    }

    .icon {
      margin-top: -${(dynamicTopCrop + topAdjustment) / 2}em;
    }
  `;
};

export default makeTextCrop;
