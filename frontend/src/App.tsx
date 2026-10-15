import { Link, Outlet } from "react-router";
import './App.css'

function App() {
  return (
    <>
      <nav><Link to="/">Home</Link> | <Link to="/charCards">Cards</Link> | <Link to="/diceRoller">Dice</Link></nav>
      <Outlet />
    </>
  )
}

export default App
