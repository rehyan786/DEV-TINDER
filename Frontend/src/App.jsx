import { Routes, Route } from "react-router-dom"
import Profile from "./component/Profile"
import Login from "./component/Login"
import Body from "./component/Body"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App