import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Welcome from "./components/Welcome";
import InProgress from "./components/InProgress";
import SignUp from "./components/Authentication/SignUp";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard/Dashboard";
import {Onboarding} from "./components/Newuserflow/Onboarding";
import SheskaList from "./components/SheskaList/SheskaList";
import NewItem from "./components/SheskaList/NewItem";
import Login from "./components/Authentication/Login";
import ResetPassword from "./components/Authentication/ResetPassword";

function App() {
  return (

      <Router>
          <Routes>
              <Route path={"/"} element={<><Welcome/></>}></Route>
              <Route path={"/about"} element={<><InProgress /></>}></Route>
              <Route path={"/login"} element={<><Login/></>}></Route>
              <Route path={"/signup"} element={<><SignUp/></>}></Route>
              <Route path={"/dashboard"} element={<><Nav/> <Dashboard/></>}></Route>
              <Route path={"/sheskalist"} element={<><Nav/> <SheskaList/></>}></Route>
              <Route path={"/onboarding"} element={<><Onboarding/></>}></Route>
              <Route path={"/newitem"} element={<><Nav/><NewItem/></>}></Route>
              <Route path={"/resetpassword"} element={<><ResetPassword/></>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
