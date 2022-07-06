import { useState, useEffect } from "react"
import { auth, db } from "../firebase.js"
import { uid } from "uid"
import { collection, onSnapshot, query, where } from "firebase/firestore"

export default function Fetch() {
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
  return (
    <>
      hi
      {todos != null
        ? todos.map((todo) => {
            return <h1>{todo.title}</h1>
          })
        : null}
    </>
  )
}
