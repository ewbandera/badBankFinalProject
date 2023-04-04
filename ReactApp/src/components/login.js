import React from 'react';
import {UserContext,Card} from './context';
import{logInWithEmailAndPassword, signInWithGoogle} from './firebase';

function Login(props){
  const [status, setStatus]     = React.useState('');
  const [show, setShow]         = React.useState(true);
  const ctx = React.useContext(UserContext);

  if(ctx.currentUser){
    window.location.replace('/#');
    return;
  }

  return (
    <>
    <Card
      bgcolor="#30718E"
      header="Please Login"
      status={status}
      body={show ? (  
        <CreateLoginForm setShow={setShow} setStatus={setStatus} reloadCallback={props.reloadCallback} />
      ):(
        <CreateMsg />
      )}             
    />
    </>
  );
}

function CreateLoginForm(props) {
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const ctx = React.useContext(UserContext);

  

  async function handleLogin() {
    
    const results = await logInWithEmailAndPassword(email,password);
    if(results){
      console.log('successful authentication attempt');
      props.setStatus('You Are Successfully Logged In');
      props.setShow(false);
    }
    else{
      console.log('bad authentiction attempt');
        ctx.currentUser = null;
        props.setStatus('Error: Username Password Combination Not Recognized');
        console.log('bad authentiction attempt1');
        setTimeout(() => props.setStatus(''),3000);
    }
  }
  async function handleGoogleLogin() {
    
    const results = await signInWithGoogle();
    if(results){
      console.log('successful authentication attempt');
      props.setStatus('You Are Successfully Logged In');
      props.setShow(false);
    }
    else{
      console.log('bad authentiction attempt');
        ctx.currentUser = null;
        props.setStatus('Error: No Google Authentication');
        console.log('bad authentiction attempt1');
        setTimeout(() => props.setStatus(''),3000);
    }
  }
  return (
    <>
    Email<br/>
    <input type="input" className="form-control" id="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.currentTarget.value)} /><br/>
    Password<br/>
    <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.currentTarget.value)}/><br/>
    <div className="cardBtn">
      <button id="loginButton" type="submit" className="btn btn-light form-control" onClick={handleLogin}>Login With Email</button><br /><br />
      <button id="loginButton" type="submit"  onClick={handleGoogleLogin}><img class="googleSignin" src='images/btn_google_signin_dark_normal_web.png' /></button>
    </div>
    </>
  )
}

function CreateMsg(props){
  return(
    <>
      <h5>Success</h5>
      <a type="submit" className="btn btn-light" href="#/">Ok</a>
    </>
  )
}

export default Login;
