import { initializeApp } from "firebase/app";

import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,signOut,onAuthStateChanged,signInWithPopup,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = require('./firebaseConfig.js');  //keeps the config secure in a seperate file
const app = initializeApp(firebaseConfig());
const auth = getAuth(app);

const logInWithEmailAndPassword = async (email, password) => {
    try {
      //console.log('Loggin In');
      const results = await signInWithEmailAndPassword(auth, email, password);
      return true;  //successful login
    } catch (err) {
      console.error('Failed Authentication in logInWithEmailAndPassword', err);
      //alert(err.message);
      return false;
    }
  };

  const registerWithEmailAndPassword = async (name, email, password,role) => {
    try {
      console.log('creating user firebase');
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      return await createMongoLogin(name,email,password, user.uid,role);
    } catch (err) {
     // console.error(err.message);
      //return({"error":"Account was not created - firebase error"});
      throw(err);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const logout = () => {
    signOut(auth);
  };

  async function createMongoLogin(name,email, password, firebaseId, role)  {
    try{
      var res = await fetch('/account/create',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name,email,password,firebaseId,role})
        });
        var data = await res.json();
        return data;  //data is json
    }
    catch(err){
      console.error(err.message);
      throw Error({"error":"Account was not created - trouble contacting service page"});
    }
  }

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return true
  } catch (err) {
    console.error(err);
    return false;
  }
};
  
  export {
    auth,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    onAuthStateChanged,
    signInWithGoogle,
    createMongoLogin
  };