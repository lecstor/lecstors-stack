import { useEffect } from "react";
import { useRecoilState } from "recoil";
import pageTitle from "./pageTitleAtom";

function usePageTitle(newTitle?: string) {
  const [title, setTitle] = useRecoilState(pageTitle);
  useEffect(() => {
    if (newTitle) setTitle(newTitle);
  }, [newTitle]);
  return [title, setTitle];
}

export default usePageTitle;
