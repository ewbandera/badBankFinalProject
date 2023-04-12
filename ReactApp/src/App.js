import React from 'react';
import {Route, HashRouter} from 'react-router-dom';
import AllData from './components/alldata';
import CreateAccount from './components/createaccount';
import Deposit from './components/deposit';
import Home from './components/home';
import Login from './components/login';
import Logout from './components/logout';
import NavBar from './components/navbar';
import Withdraw from './components/withdraw';
import Transactions from './components/transactions';
import Transfer from './components/transfer';
import {UserContext} from './components/context'
import { auth,onAuthStateChanged,createMongoLogin } from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [reload, setReload] = React.useState(false);
  const[loggedIn,setLoggedIn]=React.useState(false);
  const[state,setState] = React.useState({currentUser: null});
  const [user, loading, error, onChange] = useAuthState(auth);

  React.useEffect(() => { 
    //console.log('calling useeffect app');
    if(loading){
      console.log('loading');
      return;
    }
    if(user) {
      //console.log('use effect with user', user,state);
      getUser(user.uid)
        .then((doesUserExist) => {
          //console.log('doesUserExist',doesUserExist);
          if(!doesUserExist && state.authProvider=='google.com')
          {
            register(user.displayName,user.email,"",user.uid,"Guest");
          }
        });
    }
  },[loggedIn]);

  
  const register = (name,email,password,firebaseId,role) => createMongoLogin(name,email,password,firebaseId,role)
  .then((res,err) => {
    if (err) {
      alert('Something went wrong with automatic account creatioon'); 
      console.log('something went wrong ' ,err,res);    
    } else {
      setState({currentUser:{ name,email,password,firebaseId,"role":"Guest","balance":10000,"id":res._id},authProvider:"google.com"});    
      alert('Account initialized as guest level.  Please contact support to have your credentials upgraded'); 
      
    }       
  });

  onAuthStateChanged(auth, async (user)=>{
    console.log('auth state changed app', user);
      if(user&&loggedIn) {
        //console.log('stop redundacy');
        return; 
      } 
     if(user){
       // console.log('switch to true');
        setLoggedIn(true);
        if(user.providerData[0].providerId== "google.com"){  //if it's google auth
            setState({...state,authProvider:"google.com"});
        }
        else{
          setState({...state,authProvider:"email"});
          //console.log('email user login', state);
        }
     } else {
       //console.log('switch to false');
       //if (loggedIn) setLoggedIn(false);
       setLoggedIn(false);
     }
     
  });
  
  async function getUser(firebaseId) {
      let results = false;
      var res = await fetch(`/account/firebaseId/${firebaseId}`);
      var data = await res.json();
      if(data._id) {
        
        setState({"currentUser": {"name":data.name,"email":data.email,"firebaseId":data.firebaseId,"role":data.role,"balance":data.balance,"id":data._id}});
        results = true;
      }
      else{
        results = false;
      }
      return results;     
  }

  function doRefresh(context){
    //console.log('doing refresh');
    setState(context);
    setReload(!reload); //will toggle so that it changes every time
  }
  return (
    
    <HashRouter>
      <UserContext.Provider value={state}>
        <NavBar/>
        <div className="container" style={{padding: "20px"}}>
          <Route path="/" exact render={(props)=><Home {...props} reloadCallback={doRefresh} />} />
          <Route path="/createaccount/" component={CreateAccount} />
          <Route path="/login/" render={(props)=><Login {...props} reloadCallback={doRefresh} />} />
          <Route path="/deposit/" render={(props)=><Deposit {...props} reloadCallback={doRefresh} />} />
          <Route path="/withdraw/" render={(props)=><Withdraw {...props} reloadCallback={doRefresh} />} />
          <Route path="/transfer/" render={(props)=><Transfer {...props} reloadCallback={doRefresh} />} />
          <Route path="/transactions/" render={(props)=><Transactions {...props} reloadCallback={doRefresh} />} />
          <Route path="/alldata/" render={(props)=><AllData {...props} reloadCallback={doRefresh} />} />
          <Route path="/logout/" render={(props)=><Logout {...props} reloadCallback={doRefresh} />} />
        </div>
      </UserContext.Provider>      
    </HashRouter>
  );
}

export default App;
