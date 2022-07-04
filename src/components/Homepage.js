import React, { useEffect,useState } from 'react';
import { signOut,onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../firebase.js";
import{useNavigate, useParams, } from "react-router-dom";
import { uid } from "uid";
import {set,ref, onValue, remove,update} from "firebase/database";
import './homepage.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {  deleteDoc,doc, setDoc,collection,addDoc,updateDoc,arrayUnion,onSnapshot,query, where, arrayRemove} from "firebase/firestore"; 
import { Checkbox } from '@mui/material';

export default function Homepage() {
    const [todo, setTodo]=useState("");
    const [DueDate, setDueDate]=useState(0);
    const [todos, setTodos] =useState([]);
    const[isEdit,setIsEdit]=useState(false);
    const [tempUidd, setTempUidd]= useState("");
    const navigate = useNavigate();
   
    
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if (user){
            onSnapshot(query(  collection(db, "tasks"),where("owner","==",auth.currentUser.uid)),snapshots=>{
                setTodos([]);
                const List=[];
                snapshots.forEach(doc=>{ 
                    List.push(doc.data())


                 })
                 setTodos(List);
            });
            }
            else if(!user){
                navigate('/');
            };
        });
    },[]);


    const handleSignOut= () =>{
        signOut(auth).then(()=>{
            navigate('/');
        }).catch((err)=>{alert(err.message);});
    };
    
    const writeToDatabase=()=>{
        console.log(DueDate)
        if(!todo||!DueDate) return ;
        const userRef=doc(db,"Users",auth.currentUser.uid);
       
        const uuid=uid ();
        const collectionRef= doc(db,"tasks",uuid);
        updateDoc (userRef, {tasks:arrayUnion(uuid)});
        setDoc(collectionRef,{title:todo,DueDate,Status:"incomplete",owner: auth.currentUser.uid, uuid});
        
        
       

        setTodo("");
        


    };
    const handleUpdate = (todo) => {
        setIsEdit(true);
        setTodo(todo.title);
        setTempUidd(todo.uuid);
        
    };
    
    const handleComplete=(e,todo)=>{
        updateDoc(doc(db,"tasks",todo.uuid) , {Status:e.currentTarget.checked? "complete": `incomplete`})

    };
    const handleEditConfirm=()=>{
        updateDoc(doc(db,"tasks",tempUidd),{
            title: todo,
           
        });
        setTodo("");
        setIsEdit(false);
    };
    const handleDelete = (uid) =>{
        deleteDoc(doc(db, "tasks",uid));
        const userRef=doc(db,"Users",auth.currentUser.uid);
        updateDoc(userRef,{tasks: arrayRemove(uid)})
        
    };
  

  return (
    <div 
        className="homepage">
        <input
        className="add-edit-input"
        
        type="text" placeholder ="   Add todo... " value={todo} onChange={(e) => setTodo(e.target.value)}/>
        <input type="date"  onChange={(e) => setDueDate( new Date( e.target.value).valueOf()) }></input>
        {todos.map((todo) => {
            const currentDate= Date.now();
            if(currentDate>todo.DueDate&& todo.Status=="incomplete"){
                updateDoc(doc(db,"tasks",todo.uuid) , {Status:`fail`})
            }

            return <div className="todo">

                <h1>{todo.title}</h1>
                {todo.Status!="fail" &&  <input type="checkbox" onChange={(e)=> handleComplete(e,todo)}></input>}
                <EditIcon fontSize="large" onClick ={()=>handleUpdate(todo)} className="edit-button"/>
                <HighlightOffIcon fontSize="large" onClick={()=> handleDelete(todo.uuid)} className="delete-button"/>

            </div>
        })}
       

        {isEdit ? (
        <div>
            <CheckCircleOutlineRoundedIcon  onClick={handleEditConfirm}className="add-icon"/>        
        </div>
        ) : (
            <div>
                <AddCircleOutlineIcon onClick={writeToDatabase} className="add-icon"/>
                
            </div>

    )}
        <ExitToAppRoundedIcon fontSize='large' onClick={handleSignOut} className="sign-out"/>
    </div>
  );
}
