import React, {useState,useEffect} from 'react';
import { signInWithEmailAndPassword, onAuthStateChange,createUserWithEmailAndPassword } from "firebase/auth";
import { auth ,db} from '../firebase.js';
import {useNavigate} from"react-router-dom";
import './welcome.css'
import todosvg from '../assets/todo-svg.svg'
import { sendEmailVerification } from 'firebase/auth';
import {  doc, setDoc } from "firebase/firestore"; 

export default function Welcome() {
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const navigate=useNavigate();
    const[isRegistering,setIsRgistering]=useState(false);
    const[registerInformation,setRegisterInformation]=useState({    
        name:"",
        email:"",
        confirmEmail:"",
        password:"",
        confirmPassword:""
    });
    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
        if(user){
            navigate('/homepage');
        }
        });
    },[]);
    const handleEmailChange=(e)=>{
        setEmail(e.target.value);
    };
    const handlePasswordChange=(e)=>{ 
        setPassword(e.target.value);
    };
    const handleSignIn=()=>{
        signInWithEmailAndPassword(auth, email, password).then(()=>{
            navigate('/homepage')
        }).catch((err)=>alert(err.massage));
    };
 const handleRegister=()=>{
  if(registerInformation.email !==registerInformation.confirmEmail||registerInformation.password !== registerInformation.confirmPassword){
    alert("Please confirm your email or password")
    return 
  }
    createUserWithEmailAndPassword(auth,registerInformation.email,registerInformation.password,).then((Users)=>{
        const collectionRef =doc (db,"Users",Users.user.uid); 
        setDoc (collectionRef, {name: registerInformation.name,email: registerInformation.email,tasks:[]});

        
        navigate("/homepage");
    }).catch((err) => alert(auth,email,password)
 )};  
  return (
    <div className="welcome">
      <img src={todosvg} className="todo-svg"/>
        <h1>Todo-List</h1>
        <div className="login-register-container">
          {
            isRegistering ?(<>
              <input type="name" placeholder=" Name"value={registerInformation.name} onChange={(e)=>setRegisterInformation({...registerInformation,name: e.target.value})}/>
              <input type="email" placeholder=" Email"value={registerInformation.email} onChange={(e)=>setRegisterInformation({...registerInformation,email: e.target.value})}/>
              
              <input type="email" placeholder=" Confirm Email"value={registerInformation.confirmEmail} onChange={(e)=>setRegisterInformation({...registerInformation,confirmEmail: e.target.value})}/>
            <input type="password" placeholder=" Password" value={registerInformation.password} onChange={(e)=>setRegisterInformation({...registerInformation,password: e.target.value})}/>
            <input type="password" placeholder=" Confirm Password"value={registerInformation.confirmPassword} onChange={(e)=>setRegisterInformation({...registerInformation,confirmPassword: e.target.value})}/>
            <button className="sign-in-button" onClick={handleRegister}> Register</button>
            
            <button className="create-account-button" onClick={()=>setIsRgistering(false)}>
                Go back
            </button>
            
            
            
            
            </>):(
            <>
              <input placeholder=' Email' type="email" onChange={handleEmailChange} value={email}/>
            <input type="password" onChange={handlePasswordChange} value={password} placeholder=' Password'/>
            
            <button className="sign-in-button" onClick={handleSignIn}> Sign In</button>

            <button className="create-account-button" onClick={()=>setIsRgistering(true)}>Create an account</button>


            </> 
          )}
        </div>
        
     </div>
  )
}
