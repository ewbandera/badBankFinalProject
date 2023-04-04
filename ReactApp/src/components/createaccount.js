import React from 'react';
import {UserContext,Card} from './context';
import { auth, registerWithEmailAndPassword} from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function CreateAccount(){
  const [show, setShow]         = React.useState(true);
  const [status, setStatus]     = React.useState('');
  const [goHome, setGoHome]     = React.useState(false);
  const ctx = React.useContext(UserContext);

  React.useEffect(()=> {
    if(goHome)
    {
      setTimeout(()=>window.location.replace('/#'),5000);
      return;
    }
    if(ctx.currentUser){
      setStatus('Please Logout to create new account');
      setShow(false);
      setTimeout(()=>window.location.replace('/#/logout'),5000);
      
      return;
    }

  },[goHome]);
  
  return (
    <>
    <Card
      bgcolor="#30718E"
      status={status}
      header="Create Account"
      body={  show ?<CreateForm  setShow={setShow} setStatus={setStatus} setGoHome={setGoHome}/>:<CreateMsg setShow={setShow} setStatus={status}/>
            } />
    
    </>
  )
}
function CreateMsg(props){
	return(
	  <h5>{props.status}</h5>
	)
}
function CreateForm(props){
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] =         React.useState('Guest');
  const ctx = React.useContext(UserContext);  

  function handleCreate(){
    console.log(name,email,password);
    if (!validate(name,     'name'))     return;
    if (!validate(email,    'email'))    return;
    if (!validate(password, 'password')) return;
    if(!validateEmail(email)) return;
    if(!validatePassword(password)) return;
    console.log(role);
    //alert('Successfully Created Account');
    registerWithEmailAndPassword(name,email,password,role)
      .then((res,err) => {
        if (err) {
          console.log(err);
          props.setStatus('Something went wrong. Account not created');
          props.setShow(false);
          setTimeout(()=>{
            clearForm();
            props.setStatus('');
            props.setShow(true);
          },3000);
        } else {
          clearForm();
          props.setStatus(`Account for ${email} successfully created.  Redirecting to home`);
          props.setShow(false);
          props.setGoHome(true);          
        }       
      })
  }    
  function clearForm(){
    setName('');
    setEmail('');
    setPassword('');
    setRole('Guest');
  }
  

  function validate(field, label){
      if (!field) {
        props.setStatus(`The ${label} field is missing`);
        setTimeout(() => props.setStatus(''),3000);
        return false;
      }
      return true;
  }
  function validateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
      return true;
    }
    else{
      props.setStatus('Email not in valid form');
      setTimeout(() => props.setStatus(''),3000);
      return false
    }
  }
  function validatePassword(input)
  {
    var validRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (input.match(validRegex)) {
      return true;
    }
    else{
      props.setStatus('Password must have one upper, one lower, a special character, and be length 8');
      setTimeout(() => props.setStatus(''),3000);
      return false
    }
    
  }
return(
  <>
  Name<br/>
  <input type="input" 
    className="form-control" 
    id="name" placeholder="Enter name" 
    value={name} 
    onChange={e => setName(e.currentTarget.value)} /><br/>
  
  Email address<br/>
  <input type="input" 
    className="form-control" 
    id="email" 
    placeholder="Enter email" 
    value={email} 
    onChange={e => setEmail(e.currentTarget.value)}/><br/>
  
  Password<br/>
  <input type="password" 
    className="form-control" 
    id="password" 
    placeholder="Enter password" 
    value={password} 
    onChange={e => setPassword(e.currentTarget.value)}/><br/>
    Role<br/>
    <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
      <option class="dropdown-item">Guest</option>
      <option class="dropdown-item">User</option>
      <option class="dropdown-item">Admin</option>
    </select>
    
  <div className="cardBtn">
    <button type="submit" 
      className="btn btn-light" 
      onClick={handleCreate}>Create Account</button>
  </div>
  </>
)

}
export default CreateAccount;