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
import Listeditor from "./components/Listeditor/Listeditor";
import {Onboarding} from "./components/Newuserflow/Onboarding";

function App() {
  return (

      <Router>
          <Routes>
              <Route path={"/"} element={<><Welcome/></>}></Route>
              <Route path={"/about"} element={<><InProgress /></>}></Route>
              <Route path={"/signup"} element={<SignUp/>}></Route>
              <Route path={"/dashboard"} element={<><Nav/> <Dashboard/></>}></Route>
              <Route path={"/listeditor"} element={<><Nav/> <Listeditor/></>}></Route>
              <Route path={"/onboarding"} element={<><Onboarding/></>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
