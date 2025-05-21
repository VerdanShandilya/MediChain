import "./App.css";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AddPatient from "./pages/hospital/AddPatient";
import ViewOrders from "./pages/hospital/ViewOrders";
import Dispatch from "./pages/vendor/Dispatch";
import ViewShipments from "./pages/vendor/ViewShipments";
import TrackShipment from "./pages/vendor/TrackShipment";
import Feedback from "./pages/hospital/Feedback";
import Addmedicine from "./pages/vendor/Addmedicine";
import AcceptShipment from "./pages/hospital/AcceptShipment";
import Dashboard from "./pages/government/Dashboard";
import ViewInventory from "./pages/hospital/ViewInventory";

function App(){
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hospital/addPatient" element={<AddPatient />} />
        <Route path="/hospital/viewOrders" element={<ViewOrders />} />
        <Route path="/vendor/dispatch" element={<Dispatch />} />
        <Route path="/vendor/viewShipments" element={<ViewShipments />} />
        <Route path="/trackShipment" element={<TrackShipment />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/vendor/Addmedicine" element={<Addmedicine />} />
        <Route path="/hospital/acceptMedicine" element={<AcceptShipment />} />
        <Route path="/government/dashboard" element={<Dashboard />} />
        <Route path="/hospital/viewInventory" element={<ViewInventory />} />
      </Routes>
    </Router>
  );
}

export default App;
