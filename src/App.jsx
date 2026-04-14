
import Login from "./pages/auth/Login";
import Panel from "./pages/agent/Panel";

import { Navigate, Route, Routes } from "react-router-dom";
import Tickets from "./pages/agent/Tickets";
import Dashboard from "./pages/agent/Dashboard";
import ShowAllTickets from "./pages/agent/ShowAllTickets";
import TicketDetails from "./pages/agent/Ticket Details";
import OutboundCall from "./pages/agent/OutboundCall";
import Customers from "./pages/agent/Customers";
import Modal from "react-modal";
import CallRoom from "./pages/agent/CallRoom";

Modal.setAppElement("#root");





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
        <Route path="callroom" element={<CallRoom/>}/>
        <Route path="makecall" element={<OutboundCall/>}/>
        <Route path="customers" element={<Customers/>}/>
        <Route path="tickets" element={<Tickets/>}>
          <Route path="alltickets" element={<ShowAllTickets/>}>
            <Route path="ticketdetails" element={<TicketDetails/>} />
          </Route>
        </Route>
      </Route>
      
      
      
      {/* {role === "admin" && <Route path="/admin" element={<AdminPanel/>} />}
      <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
    </>
  );
}

export default App;
