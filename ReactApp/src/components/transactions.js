import React from 'react';
import { Table} from 'react-bootstrap';
import {UserContext,Card} from './context'
import { auth } from "./firebase.js";

function Transactions(props){
  
  return (
    <Card
    header="Transactions"
      txtcolor="black"
      bgcolor="#FFFFF"
      width="100%"
      text="Tranactions by Date"
      body=
        {<CreateTransactions />} />     
  );
}

function CreateTransactions(props)
{
  const ctx = React.useContext(UserContext);
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    if(isLoggedIn()) {
      if(ctx.currentUser.role==="Admin"){
        auth.currentUser.getIdToken()
          .then(idToken => {
            fetch('/transactions/all', {
              method: 'GET',
              headers: {
                'Authorization': idToken
              }
            })
              .then(res => res.json())
              .then((data,err) =>  {
              setData({"transactions":data});      
            });
          });
      } else {
      fetch(`/transactions/${ctx.currentUser.id}`)
      .then(res => res.json())
      .then((data,err) =>  {
        setData({"transactions":data});
      });
      }
    }
  }, []);

  function isLoggedIn() {
    return (ctx.currentUser);
  }

  function getRows(){
   // console.log('getRowsdata',data);
    return  (isLoggedIn()&&data.transactions) ? data.transactions.map((item,i)=>{
        const c = (item.transactionType==='Withdraw')? 'negativeCurrency':'';
        return(
            <tr key={i}>
            <td>{new Date(item.transactionDate).toLocaleDateString()}</td>
            <td>{item.transactionType}</td>
            <td>{item.description}</td>
            <td className={c}>{item.amount}</td>
            <td>{item.balance}</td>
            </tr>
        )
    }
      
    ):null;
  }
  return (
    (isLoggedIn()&&ctx.currentUser.role==="Admin")?
    <AdminTable data={data} isLoggedIn={isLoggedIn}/> :
    <RegularTable data={data} isLoggedIn={isLoggedIn}/>

  )
}
function RegularTable(props) {
  function getRows(){
    return  (props.isLoggedIn&&props.data.transactions&&Array.isArray(props.data.transactions)) ? props.data.transactions.map((item,i)=>{
        const c = (item.transactionType==='Withdraw')? 'negativeCurrency':'';
        return(
            <tr key={i}>
            <td>{new Date(item.transactionDate).toLocaleDateString()}</td>
            <td>{item.transactionType}</td>
            <td>{item.description}</td>
            <td className={c}>{item.amount}</td>
            <td>{item.balance}</td>
            </tr>
        )
    }
    ):null;
  }
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Transaction Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Ending Balance</th>
          </tr>
        </thead>
        <tbody>{getRows()}
        </tbody>
      </Table>
      <p>Data Dump</p>
      {JSON.stringify(props.data)}
    </>
  )
}

function AdminTable(props) {
  function getRows(){
    return  (props.isLoggedIn&&props.data.transactions&&Array.isArray(props.data.transactions)) ? props.data.transactions.map((item,i)=>{
        const c = (item.transactionType==='Withdraw')? 'negativeCurrency':'';
        return(
            <tr key={i}>
            <td>{new Date(item.transactionDate).toLocaleDateString()}</td>
            <td>{item.userFromFriendlyName}</td>
            <td>{item.userToFriendlyName}</td>
            <td className={c}>{item.amount}</td>
            </tr>
        )
    }  
    ):null;
  }
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Transaction Date</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>{getRows()}
        </tbody>
      </Table>
      <p>Data Dump</p>
      {JSON.stringify(props.data)}
    </>
  )

}
export default Transactions;
