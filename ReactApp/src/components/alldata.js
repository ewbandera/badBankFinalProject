import React from 'react';
import { Table} from 'react-bootstrap';
import {UserContext,Card} from './context'

function AllData(props){
  
  return (
    <Card
    header="All Data In Store"
      txtcolor="black"
      bgcolor="#FFFFF"
      width="100%"
      text="User's In System"
      body=
        {<CreateAllData />} />     
  );
}
function CreateAllData(props)
{
  //const ctx = React.useContext(UserContext);
  const [data, setData] = React.useState('');

  React.useEffect(() => {
    fetch('/account/all')
      .then(res => res.json())
      .then(data =>  {
        //console.log(data);
        setData({"users":data});
      });
  }, []);
  function getRows(){
    //console.log(data);
    return  (data) ? data.users.map((item,i)=>
      <tr key={i}>
        <td>{item.email}</td>
        <td>{item.name}</td>
        <td>{item.password}</td>
      </tr>
      ):null;
  }
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>{getRows()}
        </tbody>
      </Table>
      <p>Data Dump</p>
      {JSON.stringify(data)}
    </>
  )
}
export default AllData;
