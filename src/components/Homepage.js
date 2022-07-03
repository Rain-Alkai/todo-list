import React, { useEffect,useState } from 'react';
import { signOut,onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../firebase.js";
import{useNavigate} from "react-router-dom";
import { uid } from "uid";
import {set,ref, onValue, remove,update} from "firebase/database";
import './homepage.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {  doc, setDoc,collection,addDoc,updateDoc,arrayUnion} from "firebase/firestore"; 

export default function Homepage() {
    const [todo, setTodo]=useState("");
    const [DueDate, setDueDate]=useState("");
    const [todos, setTodos] =useState([]);
    const[isEdit,setIsEdit]=useState(false);
    const [tempUidd, setTempUidd]= useState("");
    const navigate = useNavigate();
   

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if (user){
            onValue(ref(db, `/${auth.currentUser.uid}`),snapshot=>{
                setTodos([]);
                const data=snapshot.val();
                if(data !==null){
                    Object.values(data).map(todo =>{
                        setTodos((oldArray)=>[...oldArray,todo]);
                    });
                };
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
        const userRef=doc(db,"Users",auth.currentUser.uid);
        const collectionRef= collection(db,"tasks");
        const uuid=uid ();
        updateDoc (userRef, {tasks:arrayUnion(uuid)});
        addDoc(collectionRef,{title:todo,DueDate,Status:"incomplete"});
        
        
       

        setTodo("");
        


    };
    const handleUpdate = (todo) => {
        setIsEdit(true);
        setTodo(todo.todo);
        setTempUidd(todo.uidd);
        
    };
    
    
    const handleEditConfirm=()=>{
        update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`),{
            todo: todo,
            tempUidd: tempUidd
        });
        setTodo("");
        setIsEdit(false);
    };
    const handleDelete = (uid) =>{
        remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
        
    };
  

  return (
    <div 
        className="homepage">
        <input
        className="add-edit-input"

        type="text" placeholder ="   Add todo... " value={todo} onChange={(e) => setTodo(e.target.value)}/>
        <input type="date" value={DueDate} onChange={(e) => setDueDate( new Date( e.target.value).valueOf()) }></input>
        {todos.map((todo) => (
            <div className="todo">

                <h1>{todo.todo}</h1>
                <EditIcon fontSize="large" onClick ={()=>handleUpdate(todo)} className="edit-button"/>
                <HighlightOffIcon fontSize="large" onClick={()=> handleDelete(todo.uidd)} className="delete-button"/>

            </div>
        ))}
       

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
