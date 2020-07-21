import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "./App.css";
import Message from "./component/Message";
import db from "./firebase-config/firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  // runs based on given condition
  useEffect(() => {
    //effect
    setUsername(prompt("Enter your name"));
  }, []);

  useEffect(() => {
    // render only once when component mount
    db.collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data()})));
      });
  }, []);

  const sendMessages = (e) => {
    // prevent default page reload
    e.preventDefault();
    // persist data | messages to remote database
    db.collection("messages").add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // clear input field after sending message
    setInput("");
  };

  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" alt="Facebook Messenger Logo" />
      <h1>Facebook Messenger</h1>
      <h2>Welcome {username}</h2>
      <form className="app__form">
        <FormControl className="app__formControl">
          <Input className="app__input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a message..." />
          
          <IconButton
            className="app__iconButton"
            type="submit"
            onClick={sendMessages}
            variant="contained"
            color="primary"
            disabled={!input} 
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>
      <FlipMove>
        {messages.map(({id, message}) => (
          <Message key={id} username={username} message={message} />
        ))}
      </FlipMove>
    </div>
  );
}

export default App;
