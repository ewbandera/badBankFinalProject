import React from 'react';
import {UserContext,Card} from './context'
import { logInWithEmailAndPassword, logout} from "./firebase";

function Home(props){
  const ctx = React.useContext(UserContext);

  async function handleAutomaticLogin(role) {
    let results=null;
    logout();
    switch(role)
    {
      case 'Guest':
        results = await logInWithEmailAndPassword('alice@gmail.com','123456');
        break;
      case 'User':
        results = await logInWithEmailAndPassword('bob@gmail.com','123456');
        break;
      case 'Admin':
        results = await logInWithEmailAndPassword('chuck@gmail.com','123456');
        break;
    }
    if(results){
      console.log('successful authentication attempt');
    }
    else{
        ctx.currentUser = null;
        props.setStatus('Error: Username Password Combination Not Recognized');
        setTimeout(() => props.setStatus(''),3000);
    }
    props.reloadCallback(ctx);
  } 

  function isLoggedIn() {
    return (ctx.currentUser);
  } 
  function getTitle(){
    return (isLoggedIn())? `Welcome ${ctx.currentUser.name}!`:"Welcome - Please log in!"; 
  }
  return (
    <>
    <h1>Home Page</h1>
    <Card
    bgcolor="#D7E4EA"
      txtcolor="black"
      header="The Baddest Bank since 1957"
      title={getTitle()}
      body={(
        <CreateHome handleAutomaticLogin={handleAutomaticLogin} />
      )} />
    </>
  );  
}
function CreateHome(props)
{
  return (
    <>
      <img src='images/bank.png' className="img-fluid" alt="Bank Logo"/>
      <p>For Testing and demonstration purpose, there are 3 users alice@gmail.com is Demo User
      </p>
      <div className="cardBtn">
        <button className="btn btn-dark" onClick={()=>props.handleAutomaticLogin('Guest')}>Automatic Login for Demo Guest (alice)</button><br />
        <button className="btn btn-dark" onClick={()=>props.handleAutomaticLogin('User')}>Automatic Login for Demo User (bob)</button><br />
        <button className="btn btn-dark" onClick={()=>props.handleAutomaticLogin('Admin')}>Automatic Login for Demo Admin (chuck)</button>
      </div>      
    </>
  )
}
export default Home;
