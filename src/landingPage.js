import React, { Component } from 'react';
import firebase from 'firebase';
import { firebaseConfig } from './connection';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let messageRef = firebase.database().ref('messages');

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
      list: []
    }
  }

  // LOAD PREVIOUS MESSAGES ON PAGE LOAD 
  componentWillMount(){
    const previousMessages = this.state.list;

    messageRef.on('child_added', snapshot =>{
      previousMessages.push({
        id: snapshot.key,
        message: snapshot.val().text,
        name: snapshot.val().name
      })

      this.setState({
        list: previousMessages
      })
    })
  }

  // SEND DATA TO DB

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = e => {
    e.preventDefault()

    let name = this.state.name;
    let text = this.state.message;

    function saveMessage(name, text) {
      let newMessageRef = messageRef.push();
      newMessageRef.set({
        name,
        text,
      })
    }
    saveMessage(name, text);
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
          {this.state.list.map(item => {
            return (
              <li className={(item.name === 'You' ? 'right' : 'left')}
                key={item.id}
                id={item.id}>
                {item.name}: {item.message}
              </li>
            )
          })}
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