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
import Home from "./components/Home/Home";
import {Onboarding} from "./components/Newuserflow/Onboarding";
import SheskaList from "./components/SheskaList/SheskaList";
import NewItem from "./components/SheskaList/NewItem";
import Login from "./components/Authentication/Login";
import ResetPassword from "./components/Authentication/ResetPassword";
import EditItem from "./components/SheskaList/EditItem";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import ProductPage from "./components/ProductPage/ProductPage";
import AccountPreferences from "./components/AccountPreferences/AccountPreferences";
import StripeOnboardingRedirect from "./components/RedirectHandler/StripeOnboardingRedirect/StripeOnboardingRedirect";
import EmailVerificationRedirect
    from "./components/RedirectHandler/EmailVerificationRedirect/EmailVerificationRedirect";
import PageNotFound from "./PageNotFound/PageNotFound";
import Dashboard from "./components/Dashboard/Dashboard"
import ResetPasswordRedirect from "src/components/RedirectHandler/ResetPasswordRedirect/ResetPasswordRedirect";

function App() {
  return (
      <Router>
          <Routes>
              <Route path={"/editcard"} element={<><Nav/><EditItem/></>}></Route>
              <Route path={"/resetpassword"} element={<><ResetPassword/></>}></Route>
              <Route path={"/newitem"} element={<><Nav/><NewItem/></>}></Route>
              <Route path={"/"} element={<><Welcome/></>}></Route>
              <Route path={"/about"} element={<><InProgress /></>}></Route>
              <Route path={"/login"} element={<><Login/></>}></Route>
              <Route path={"/signup"} element={<><SignUp/></>}></Route>
              <Route path={"/home"} element={<><Nav/> <Home/></>}></Route>
              <Route path={"/dashboard"} element={<><Nav/> <Dashboard/></>}></Route>
              <Route path={"/sheskalist"} element={<><Nav/> <SheskaList/></>}></Route>
              <Route path={"/onboarding"} element={<><Onboarding/></>}></Route>
              <Route path={"/product"} element={<><ProductPage/></>}></Route>
              <Route path={"/loading"} element={<><LoadingScreen/></>}></Route>
              <Route path={"/accountsettings"} element={<><Nav/><AccountPreferences/></>}></Route>
              <Route path={"/stripeonboardingredirect"} element={<><StripeOnboardingRedirect/></>}></Route>
              <Route path={"/verifyemail"} element={<><EmailVerificationRedirect/></>}></Route>
              <Route path={"/resetpasswordredirect"} element={<><ResetPasswordRedirect/></>}></Route>
              <Route path="*" element={<PageNotFound/>}></Route>
          </Routes>
      </Router>
  );
}

export default App;
