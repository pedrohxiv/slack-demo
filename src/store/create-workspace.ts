import { atom, useAtom } from "jotai";

const state = atom(false);

export const useCreateWorkspace = () => {
  return useAtom(state);
};
