import React, { Component } from 'react';
import firebase from 'firebase';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: "https://message-app-2f7b3.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJEDT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: "1:318418595733:web:100410dda5ec1bc75c909c",
  measurementId: "G-KH72VESE32"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let messageRef = firebase.database().ref('messages');

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
    }
  }

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = e => {
    e.preventDefault()

    let name = this.state.name;
    let text = this.state.message;

    function saveMessage(name, text, id) {
      let newMessageRef = messageRef.push();
      newMessageRef.set({
        name,
        text,
        id
      })
    }
    saveMessage(name, text, id);
  }

  render() {
    return <div className='container'>

      {/* title */}
      <div className='titleDiv'>
        <h1>React Message App</h1>
      </div>

      {/* messages will be listed here */}
      <div className='messagesDiv'>
        <ul>
          {/* List array is mapped through*/}
          {/* {this.state.list.map(item => {
            return (
              <li className={(item.name === 'You' ? 'right' : 'left')}
                key={item.id}>
                {item.name}: {item.message}
              </li>
            )
          })} */}
        </ul>
      </div>

      {/* message text area and send button here  */}
      <div className='inputDiv'>
        <form onSubmit={this.submitHandler}>
          <input name="message"
            placeholder="Send message..."
            value={this.message}
            onChange={this.changeHandler}
            id='formText'
            required />
          <button className='submit' type="submit">Send Message</button>
        </form>
      </div>

      {/* nickname, think, delete options*/}
      <button className='button nickname'>Nickname</button>
      <button className='button think'>Think...</button>
      <button className='button delete'>Delete</button>
    </div>
  }
}

export default LandingPage;