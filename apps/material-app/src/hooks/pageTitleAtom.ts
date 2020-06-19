import { atom } from "recoil";

const pageTitle = atom<string | null>({
  key: "pageTitle",
  default: "",
});

export default pageTitle;
