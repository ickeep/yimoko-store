import { createContext, useContext } from 'react';

import { RootStore } from '../store/root';

export const rootStore = new RootStore();

export const RootContext = createContext(rootStore);

export const RootProvider = RootContext.Provider;

export const RootConsumer = RootContext.Consumer;

export const useRoot = () => useContext(RootContext);

export const useUser = () => useContext(RootContext).user;

export const useMenus = () => useContext(RootContext).menus;

export const useData = (name?: string) => {
  const { data } = useContext(RootContext);
  return typeof name === 'undefined' ? data : data[name];
};
