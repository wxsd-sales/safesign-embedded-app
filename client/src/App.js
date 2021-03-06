import React from "react"
import './App.css';
import MyNav from "./components/navbar/navbar"
import FamilyForm from "./pages/familyForm/familyForm";
import LandingPage from './pages/landing/landing'
import SigningDone from './pages/signingCompleted/signingCompleted'
//import AdminPage from "./pages/admin/admin";
import { Router } from "@reach/router"

const NotFound = () => (
  <div className='App-header'>
    <h2>Page not found, or there's been some error.</h2>
  </div>
);

function App(props) {

  return (
    <div className="App">
      <MyNav></MyNav>
      <Router>
        <LandingPage path='/' embeddedAppSDK={props.embeddedAppSDK}></LandingPage>
        <FamilyForm path='/nda/' embeddedAppSDK={props.embeddedAppSDK}></FamilyForm>      
        <SigningDone path='/signingDone/' embeddedAppSDK={props.embeddedAppSDK}></SigningDone>
        <NotFound default />
      </Router>
      
    </div>
  );
  
}

export default App;

//<AdminPage path='/admin/'></AdminPage>