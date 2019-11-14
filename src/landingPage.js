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
      list: [],
      font: "black",
    }
  }

  // LOAD PREVIOUS MESSAGES ON PAGE LOAD 
  componentDidMount() {
    const previousMessages = this.state.list;

    messageRef.on('child_added', snapshot => {
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
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  setName = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
    let textBox = document.getElementById('inputDivId');
    textBox.style.display = "flex";
    let messagesBox = document.getElementById('messagesDivId');
    messagesBox.style.display = "flex";
    let thinkDel = document.getElementById('options');
    thinkDel.style.display = "flex";
    let nameBox = document.getElementById('nameDivId');
    nameBox.style.display = "none";
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

  onPress = () => {
    if (this.state.font === 'black') {
      this.setState({ font: 'grey' });
    }
    else {
      this.setState({ font: 'black' });
    }
  }

  render() {
    return <div className='container'>

      {/* title */}
      <div className='titleDiv'>
        <h1>React Message App</h1>
      </div>

      {/* messages will be listed here */}
      <div className='messagesDiv' id='messagesDivId'>
        <ul>
          {/* List array is mapped through*/}
          {this.state.list.map(item => {
            return (
              <li className={(item.name === this.state.name ? 'right' : 'left')}
                style={{ color: this.state.font }}
                key={item.id}
                id={item.id}>
                {item.name}: {item.message}
                <button className='deleteMessage'>X</button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* message text area and send button here  */}
      <div className='inputDiv' id='inputDivId'>
        <form onSubmit={this.submitHandler}>
          <input name="message"
            className='inputBox'
            placeholder="Send message..."
            value={this.message}
            onChange={this.changeHandler}
            required />
          <button className='submit' type="submit">Send Message</button>
        </form>
      </div>

      {/* type nickname + button here  */}
      <div className='nicknameDiv' id='nameDivId'>
        <form onSubmit={this.setName}>
          <input name="name"
            className='inputBox'
            placeholder="Choose a unique nickname..."
            value={this.name}
            onChange={this.changeHandler}
            required />
          <button className='submit' type="submit">Confirm Nickname</button>
        </form>
      </div>

      {/*think, delete options*/}
      <div id='options'>
        <button id='think' className='button think' onClick={this.onPress}>Think...</button>
        <button id='delete' className='button delete'>Delete last message</button>
      </div>

    </div>
  }
}

export default LandingPage;