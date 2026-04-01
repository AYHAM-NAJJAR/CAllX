
import Login from "./pages/auth/Login";
import Panel from "./pages/agent/Panel";

import { Navigate, Route, Routes } from "react-router-dom";
import Tickets from "./pages/agent/Tickets";
import Dashboard from "./pages/agent/Dashboard";





function App() {
  // const [role] = useState(localStorage.getItem("role"));
  //  role ? <Navigate to="/main" /> 
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      {/* {role === "agent" &&  */}
      <Route path="/main" element={<Panel/>}>
        <Route index element={<Dashboard/>} />
        
        <Route path="tickets" element={<Tickets/>} />
      </Route>
      
      
      
      {/* {role === "admin" && <Route path="/admin" element={<AdminPanel/>} />}
      <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
    </>
  );
}

export default App;
