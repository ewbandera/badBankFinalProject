import React from 'react';
import {UserContext,Card} from './context'
function Withdraw(props){
  const ctx = React.useContext(UserContext);
  const [amount, setAmount] = React.useState(0);
  const [status, setStatus]     = React.useState('');
  const [show, setShow]         = React.useState(true);
  const [btDisabled, setBtDisabled] = React.useState(true);

  function isLoggedIn() {
    return (ctx.currentUser);
  }
  
  return (
    <>
    <Card
      txtcolor="black"
      bgcolor="#D7E4EA"
      status={status}
      header="Withdraw"
      body={  
        show ? (
          (isLoggedIn()) ? 
            (<CreateForm setShow={setShow} setStatus={setStatus} setAmount={setAmount} amount={amount} setBtDisabled={setBtDisabled} btDisabled={btDisabled} ctx={ctx}/>):
            (<NotLoggedInMsg />)
          ):(
        <WithdrawMsg setShow={setShow} setStatus={setStatus} setAmount={setAmount} setBtDisabled={setBtDisabled} />
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
function WithdrawMsg(props){
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
    if(!validateHasEnoughForTransaction(input)){
      props.setStatus('The transaction cannot be completed.  Please see our credit department for a loan.  Interest rates start as low as 17.99%');
      return false;
    }
    return true;
  }
  const validateHasContent = (input)=> (input.length>0);
  const validateHasEnoughForTransaction = (input) => (Number(input*100)<=Number(props.ctx.currentUser.balance));
  const validateIsNumber = (input)  => (!isNaN(input));
  const validateIsGreaterThanZero = (input) => (Number(input)>0);

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
  
  async function handleWithdraw() {
    if(validate(props.amount)) {
      props.ctx.currentUser.balance = (Number(props.ctx.currentUser.balance) - Number(props.amount*100));
      const defaultAtmUserAccount = await getATMAccount();
      var resCreateTrans = await fetch('/transaction/create',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"userIdFrom":props.ctx.currentUser.id,"userIdTo": defaultAtmUserAccount, "amount":Number(props.amount)*100})
        });
      var dataCreateTransaction = await resCreateTrans.json();
      var resUpdateBalances = await fetch('/account/updateBalance',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"userIdFrom":props.ctx.currentUser.id,"userIdTo": defaultAtmUserAccount,"amount":Number(props.amount)*100})
        });
        var dataUpdateBalances = await resUpdateBalances.json();
       // console.log(JSON.stringify(dataCreateTransaction), JSON.stringify(dataUpdateBalances));
        props.setStatus('The Withdraw Is Completed');
        props.setShow(false);
      }
  }


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
  return(
    <table className="cardTable">
      <tbody>
        <tr><td width="70%">Balance</td><td>$ {Number(props.ctx.currentUser.balance)/100}</td></tr>
        <tr>
          <td colSpan="2">Withdraw Amount<br/>
            <div className="moneyInput">
              <input type="text" min="0.01" step="0.01" max="2500" className="form-control" id="amount" onChange={e => handleChange(e.currentTarget.value)}/>
            </div>
            
          </td>
        </tr>
        <tr><td colSpan="2" className="cardBtn"><button type="submit" disabled={props.btDisabled} className="btn btn-light" onClick={handleWithdraw}>Withdraw</button></td></tr>
      </tbody>
    </table>
    );
  }
export default Withdraw;
