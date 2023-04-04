import React from 'react';
import {UserContext,Card} from './context'
import { logout} from "./firebase";
function Logout(props){
  const ctx = React.useContext(UserContext);   
    function isLoggedIn() {
      return (ctx.currentUser);
    }
    return (
      <>
      {
      (isLoggedIn())?(      
      <Card
        bgcolor="#D7E4EA"
        txtcolor="black"
        header="Logout"
        status=""
        body={
          <CreateLogoutConfirmation ctx={ctx} reloadCallback={props.reloadCallback} /> 
        }             
      />
    ):(
      <Card
        bgcolor="warning"
        txtcolor="black"
        header="Logout"
        status=""
        body={
          <h5>No users currently logged in</h5>
        }             
      />
    )}</>); 
  }
  
  function CreateLogoutConfirmation(props)
  {
    
    function handleLogout() {
      if(props.ctx.hasOwnProperty('currentUser'))
      {
        delete props.ctx.currentUser;
        logout();
      }       
      props.reloadCallback(props.ctx);  //updates the navbar - calls refresh method in App which saves context in state, and reloads page
    }
    return(
      <>
      <h5>Please Click Ok to Confirm Logout User {props.ctx.currentUser.name}</h5>
      <div className="cardBtn">
        <a className="btn btn-light" onClick={handleLogout} href="#/">Ok</a>
      </div>
      
    </>
    )
  }
  
  export default Logout;