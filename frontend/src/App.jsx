import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import SchoolDetails from "./components/Schools/SchoolDetails.jsx";
import CreateSchool from "./components/Schools/CreateSchool.jsx";
import EditSchool from "./components/Schools/EditSchool.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "schools/:schoolId",
        children: [
          {
            index: true,
            element: <SchoolDetails />,
          },
          {
            path: "edit",
            element: <EditSchool />,
          },
        ],
      },
      {
        path: "*",
        element: (
          <div className="w-full p-12">
            <h1 className="title text-center text-2xl">404 Page Not Found</h1>
          </div>
        ),
      },
      {
        path: "create-school",
        element: <CreateSchool />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
