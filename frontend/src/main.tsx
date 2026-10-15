import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./home";
import CharCards from "./char_cards";
import DiceRoller from "./dice_roller";
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Provider store={store}><App/></Provider>,
    children: [
      { index: true, element: <Home /> },
      { path: "diceRoller", element: <DiceRoller />},
      { path: "charCards", element: <CharCards />},
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
