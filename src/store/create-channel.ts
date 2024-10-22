import { atom, useAtom } from "jotai";

const state = atom(false);

export const useCreateChannel = () => {
  return useAtom(state);
};
