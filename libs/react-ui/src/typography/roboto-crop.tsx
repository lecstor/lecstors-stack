import makeTextCrop from "./make-text-crop";

const robotoCrop = makeTextCrop({
  fontFamily: "Roboto, sans-serif",
  topCrop: 10,
  bottomCrop: 11,
  cropFontSize: 32,
  cropLineHeight: 1.4
});

export default robotoCrop;
