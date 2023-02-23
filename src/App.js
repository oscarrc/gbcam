import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Layout from './components/layout';

const Main = lazy(() => import('./views/Main'));

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          id: "main",
          path: "/",
          element: <Main />
        }
      ]
    }
  ])

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
