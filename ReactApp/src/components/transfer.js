import React from 'react';
import {UserContext,Card} from './context'
function Transfer(props){
  const ctx = React.useContext(UserContext);
  const [amount, setAmount] = React.useState(0);
  const [status, setStatus]     = React.useState('');
  const [show, setShow]         = React.useState(true);
  const [data, setData]     = React.useState({users:[]});
  const [transferUser, setTransferUser] = React.useState({id:"",value:""});
  const [btDisabled, setBtDisabled] = React.useState(true);

  React.useEffect(() => {   
    fetch('/account/all')
      .then(res => res.json())
      .then(data =>  {
        setData({"users":data});
        
      });
    
  }, []);

  function isLoggedIn() {
    return (ctx.currentUser);
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
  
  return (
    <>
    <Card
      txtcolor="black"
      bgcolor="#D7E4EA"
      status={status}
      header="Transfer"
      body={  
        show ? (
          (isLoggedIn()) ? 
            (<CreateForm setShow={setShow} setStatus={setStatus} setAmount={setAmount} amount={amount} transferUser={transferUser} setTransferUser={setTransferUser} setBtDisabled={setBtDisabled} btDisabled={btDisabled} data={data}  ctx={ctx}/>):
            (<NotLoggedInMsg />)
          ):(
        <TransferMsg setShow={setShow} setStatus={setStatus} status={status} setAmount={setAmount} setBtDisabled={setBtDisabled} setTransferUser={setTransferUser} />
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

function TransferMsg(props){
  function clearForm()
  {
    props.setAmount(0);
    props.setShow(true);
    props.setBtDisabled(true);
    props.setStatus('');
    props.setTransferUser({});
  }
  return(
    <>
    <h5>{props.status}</h5>
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
  
  async function handleTransfer() {
    try{
        if(validate(props.amount)&& props.transferUser.id!="") {
            props.ctx.currentUser.balance = (Number(props.ctx.currentUser.balance) - Number(props.amount*100));
            const tranAccount = props.transferUser.id;
            try{
                var resCreateTrans = await fetch('/transaction/create',
                {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({"userIdFrom":props.ctx.currentUser.id,"userIdTo": tranAccount, "amount":Number(props.amount)*100})
                });
            }
            catch(err)
            {
                props.setStatus('Failed Transfer Creation');
                props.setShow(false);
        
            }
            var dataCreateTransaction = await resCreateTrans.json();
            try{
                var resUpdateBalances = await fetch('/account/updateBalance', {
                    method: 'post',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"userIdFrom":props.ctx.currentUser.id,"userIdTo": tranAccount,"amount":Number(props.amount)*100})
                });

            }
            catch(err)
            {
                props.setStatus('Failed Balance Update');
                props.setShow(false);
        
            }
            
            var dataUpdateBalances = await resUpdateBalances.json();
            //console.log(JSON.stringify(dataCreateTransaction), JSON.stringify(dataUpdateBalances));
            props.setStatus('The Transfer Is Completed');
            props.setShow(false);
        }
        else {alert('select user');}
    }
    catch(err)
    {
        props.setStatus('Failed Transfer');
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

  function getRows(){
    const filteredResults = (props.data) ? props.data.users.filter(item => item.name!='Bank ATM'&&item._id!=props.ctx.currentUser.id):null;//just remove ATM from transfer
    //console.log('filtered results',filteredResults);
    return  (props.data) ? filteredResults.map((item,i)=>
      <option class="dropdown-item" key={i} id={item._id} onClick={e => updateTransUser(e)}>{item.name}</option>
      ):null;
  }
  
  function updateTransUser(e){
    props.setTransferUser({"id":e.target.id,"value":e.target.value});
  }

  return(
    <table className="cardTable">
      <tbody>
        <tr><td width="70%">Balance</td><td>$ {Number(props.ctx.currentUser.balance)/100}</td></tr>
        <tr>
            <td colspan="2">
                Remote User<br/>
                <select className="form-control" id="userDropdown" value={props.transferUser.value}>
                    {getRows()}
                </select><p>{`Sending to: ${(props.transferUser.value==="")? "Please Select" : props.transferUser.value}`}</p>
            </td>
        </tr>
        <tr>
          <td colSpan="2">Transfer Amount<br/>
            <div className="moneyInput">
              <input type="text" min="0.01" step="0.01" max="2500" className="form-control" id="amount" onChange={e => handleChange(e.currentTarget.value)}/>
            </div>
            
          </td>
        </tr>
        <tr><td colSpan="2" className="cardBtn"><button type="submit" disabled={props.btDisabled} className="btn btn-light" onClick={handleTransfer}>Transfer</button></td></tr>
      </tbody>
    </table>
    );
  }
export default Transfer;
