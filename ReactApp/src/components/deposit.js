import React from 'react';
import {UserContext,Card} from './context'


function Deposit(props){
  const ctx = React.useContext(UserContext);
  
  const [status, setStatus]     = React.useState('');
  const [show, setShow]         = React.useState(true);
  const [amount, setAmount] = React.useState(0);
  const [btDisabled, setBtDisabled] = React.useState(true);
  
  function isLoggedIn() {
    return (ctx.currentUser);
  }

  return (
    <>
    <Card
      bgcolor="#D7E4EA"
      txtcolor="black"
      status={status}
      header="Deposit"
      body={  
        show ? (
          (isLoggedIn()) ? 
            (<CreateForm setShow={setShow} setStatus={setStatus} setAmount={setAmount} amount={amount} setBtDisabled={setBtDisabled} btDisabled={btDisabled} ctx={ctx}/>):
            (<NotLoggedInMsg />)
          ):(
        <DepositMsg setShow={setShow} setStatus={setStatus} setAmount={setAmount} setBtDisabled={setBtDisabled} />
        )
      }
    />
    </>
  );
}
function NotLoggedInMsg(){
  return(
    <>
    <p>You must be logged in to access this feature</p>
    <a href="#/login/" className="btn btn-light">Login</a>
    </>
  )
}
function DepositMsg(props){
  function clearForm()
  {
    props.setAmount(0);
    props.setShow(true);
    props.setBtDisabled(true);
    props.setStatus('');
  }
  return(
    <>
    <h5>Success</h5>
    <button type="submit" className="btn btn-light" onClick={clearForm}>Ok</button>
  </>
  )
}
function CreateForm(props) {
  function validate(input)
  {
    if(!validateHasContent(input)){
      props.setStatus('');
      return false;
    }
    if(!validateIsNumber(input)){
      props.setStatus('Please enter a numerical value');
      return false;
    }
    if(!validateIsGreaterThanZero(input)){
      props.setStatus('Please enter a value greater than $0');
      return false;
    }
    return true;
  }
  const validateHasContent = (input)=> (input.length>0);
  const validateIsNumber = (input)  => (!isNaN(input));
  const validateIsGreaterThanZero = (input) => (Number(input)>0);
  
  function handleChange(input)
  {
     if(validate(input))
     {
      props.setBtDisabled(false);
      props.setStatus('');
      props.setAmount(input);
     }
     else{
      props.setBtDisabled(true);
     }
  }
  async function getATMAccount()
  {
    const res = await fetch('/account/default');
    var data = await res.json();
    let results = "";
      if(data._id) {
        
        results = data._id;
      }
      return results;     
  }
  async function handleDeposit() {
      props.ctx.currentUser.balance = (Number(props.ctx.currentUser.balance) + Number(props.amount*100));
      const defaultAtmUserAccount = await getATMAccount();
      var resCreateTrans = await fetch('/transaction/create',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"userIdFrom":defaultAtmUserAccount,"userIdTo": props.ctx.currentUser.id, "amount":Number(props.amount)*100})
        });
      var dataCreateTransaction = await resCreateTrans.json();
      var resUpdateBalances = await fetch('/account/updateBalance',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"userIdFrom":defaultAtmUserAccount,"userIdTo": props.ctx.currentUser.id,"amount":Number(props.amount)*100})
        });
      var dataUpdateBalances = await resUpdateBalances.json();
    
     // console.log(JSON.stringify(dataCreateTransaction), JSON.stringify(dataUpdateBalances));
      props.setStatus('The Deposit Is Completed');
      props.setShow(false);
  }
  return(
  <>
    <table className="cardTable">
      <tbody>
        <tr><td width="70%">Balance</td><td>$ {Number(props.ctx.currentUser.balance)/100}</td></tr>
        <tr>
          <td colSpan="2">Deposit Amount<br/>
            <div className="moneyInput">
              <input type="text" min="0.01" step="0.01" max="2500" className="form-control" id="amount" onChange={e => handleChange(e.currentTarget.value)}/>
            </div>
          </td>
        </tr>
        <tr><td colSpan="2" className="cardBtn"><button type="submit" className="btn btn-light" disabled={props.btDisabled} onClick={handleDeposit}>Deposit</button></td></tr>
      </tbody>
    </table>
    </>
    );
}
export default Deposit;
