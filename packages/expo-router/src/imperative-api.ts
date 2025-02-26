import { store } from "./global-state/router-store";
import { Router } from "./types";

export const router: Router = {
  push: (href) => store.push(href),
  replace: (href) => store.replace(href),
  back: () => store.goBack(),
  setParams: (params) => store.setParams(params),
};
