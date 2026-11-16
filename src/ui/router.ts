import { findRoute, normalizeHashPath, type RoutePath } from '../core/routing';

export type Route = {
  path: RoutePath;
  title: string;
  render: () => HTMLElement;
};

type RouterOptions = {
  outlet: HTMLElement;
  routes: readonly Route[];
  notFound: Route;
  appTitle: string;
  onNavigate?: (path: RoutePath) => void;
};

export const startRouter = ({
  outlet,
  routes,
  notFound,
  appTitle,
  onNavigate,
}: RouterOptions): void => {
  const render = (isInitial: boolean): void => {
    const path = normalizeHashPath(window.location.hash);
    const route = findRoute(routes, path) ?? notFound;

    outlet.replaceChildren(route.render());
    document.title = `${route.title} | ${appTitle}`;
    onNavigate?.(route.path);

    if (!isInitial) {
      window.scrollTo({ top: 0 });
      outlet.querySelector<HTMLElement>('h1')?.focus();
    }
  };

  window.addEventListener('hashchange', () => render(false));
  render(true);
};
