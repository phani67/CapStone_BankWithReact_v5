function Deposit(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      bgcolor="warning"
      header="Deposit"
      status={status}
      body={show ? 
        <DepositForm setShow={setShow} setStatus={setStatus}/> :
        <DepositMsg setShow={setShow}/>}
    />
  )
}

function DepositMsg(props){
  return (<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Deposit again
    </button>
  </>);
} 

function DepositForm(props){
  const [email, setEmail]   = React.useState('');
  const [amount, setAmount] = React.useState('');
  const ctx = React.useContext(UserContext);  

  async function handle(){
    console.log(email,amount);
    const user = ctx.users.find((user) => user.email == email);
    if (!user) {
      props.setStatus('fail!');
      return;      
    }

    try {
      const url = '/account/deposit'; // Replace with your backend API endpoint for deposit
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: Number(amount) }), // Provide the amount to be deposited
      };
  
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      const currentBalance = data.balance;
      data.balance = data.balance + Number(amount);
      const newBalance = data.balance; // This is the balance after the deposit
      const depositAmount = Number(amount);

      const statusMessage =
      'Deposit successful!\n' +
      'Current Balance: ' + currentBalance + '\n' +
      'New Balance: ' + newBalance + '\n' +
      'Deposit Amount: ' + depositAmount + '\n' +
      
      console.log(user);
      props.setStatus(statusMessage);
      props.setShow(false);
    } catch (error) {
      console.error('Error depositing:', error);
      props.setStatus('Failed to deposit.');
    }
  

    /*
    user.balance = user.balance + Number(amount);
    console.log(user);
    props.setStatus('');      
    props.setShow(false);
    */
  }

  return(<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} onChange={e => setEmail(e.currentTarget.value)}/><br/>
      
    Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>Deposit</button>

  </>);
}