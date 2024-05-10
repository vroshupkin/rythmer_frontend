import { Main } from '../pages/Main';
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BooksPage } from './Books.page';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Link to="/"/>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routers = 
[
  {
    getParentRoute: () => rootRoute,
    path: '/',
    component: Main
  },
  {
    getParentRoute: () => rootRoute,
    path: '/books',
    component: BooksPage
  }
].map(createRoute);

const routeTree = rootRoute.addChildren(routers);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) 
{
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}