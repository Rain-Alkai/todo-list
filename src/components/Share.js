import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase.js"
import "./share.css"
import LinkIcon from '@mui/icons-material/Link';
import { uid } from "uid"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import todoshare from '../assets/todo-share.svg'
export default function Share() {
  const [todos, setTodos] = useState()
  const getTodos = () => {
    onSnapshot(
      query(
        collection(db, "tasks"),
        where("owner", "==", auth.currentUser.uid)
      ),
      (snapshots) => {
        setTodos([])
        const List = []
        snapshots.forEach((doc) => {
          List.push(doc.data())
        })
        setTodos(List)
      }
    )
  }

  useEffect(() => {
    getTodos()
  })
  console.log(auth.currentUser.uid)
  const [popup, setPopup] = useState(false)
  const navigate = useNavigate()

  const baseUrL = "http://localhost:3000/homepage/Share?jYbEGqGoTwgu1f1ra27KzE4rcYA3"

  const sharedURL = `${baseUrL}/Share?${auth.currentUser.uid}`
  
  function getUserData(uid) {
    db.ref("users/" + uid).once("value", (snap) => {
      console.log(snap.val())
    })
  }
  const openPopup = () => {
    setPopup(true)
  }

  const closePopup = () => {
    setPopup(false)
  }

  return (
    <div>
    <div className="mypage">
      
      <h2 className="checkout">Check out my tasks:</h2>
      <LinkIcon
        fontSize="large"
        onClick={openPopup}
        className="sign-out"
      />
     
      <>
      
      {todos != null
        ? todos.map((todo) => {
            return <div className="Sharetodo"> <h1  >{todo.title}</h1>
          </div>})
        : null}
    </>
      <div>
        {popup ? (
          <div>
            <div className="popup">
              <div className="popup-header">
                <h1> here is your url!</h1>
                <button className="btn" onClick={closePopup}>
                  x
                </button>
              </div>
              <div>
                <p>{sharedURL}</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
    <img src={todoshare} className="todo-share"/></div>
  )
}
