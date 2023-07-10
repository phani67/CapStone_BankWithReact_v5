//import React, { useState } from 'react';
//import Card from 'context';
//import { UserContext } from 'store';
//import Error from 'error';
import firebase from 'firebase/app';
import 'firebase/auth';


function Login(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');    

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function LoginMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Authenticate again
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  async function handle() {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;

      if (user) {
        // Authorization successful
        props.setStatus('');
        props.setShow(false);
      } else {
        // Authorization failed
        props.setStatus('Authorization failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error authorizing:', error);
      props.setStatus('Failed to authorize. Please try again later.');
    }
  }

/*  const ctx = React.useContext(UserContext);  

  async function handle() {
    try {
      const url = '/account/login'; // Replace with your backend API endpoint for login
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Provide the email and password for authentication
      };

      const res = await fetch(url, requestOptions);
      const data = await res.json();

      if (data.success) {
        // Authentication successful
        props.setStatus('');
        props.setShow(false);
      } else {
        // Authentication failed
        props.setStatus('Authentication failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error authenticating:', error);
      props.setStatus('Failed to authenticate. Please try again later. Message from front end.');
    }
  }
  */

  /*
  function handle(){
    const user = ctx.users.find((user) => user.email == email);
    console.log(user);
    console.log(email, password);
    if (!user) {
      console.log('one')      
      props.setStatus('fail!')      
      return;      
    }
    if (user.password == password) {
      console.log('two')            
      props.setStatus('');
      props.setShow(false);
      return;      
    }
    console.log('three')          
    props.setStatus('fail!');        
  }

*/
  return (<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </>);
}