import React, { Component } from 'react';
import firebase from 'firebase';
import { firebaseConfig } from './connection';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let messageRef = firebase.database().ref('messages');
let listRef = firebase.database().ref('users');

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      message: '',
      list: [],
      names: [],
      font: "black",
    }
  }

  // LOAD PREVIOUS MESSAGES ON PAGE LOAD 
  componentDidMount() {
    const previousMessages = this.state.list;

    messageRef.limitToLast(10).on('child_added', snapshot => {
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

  // CHANGE STATE WITH INPUT DATA 
  changeHandler = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }
  // WHEN NAME SET, SHOW DIVS, ALSO SEND NAME TO DB FOR USER INSTANCES
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

    // ADD USER TO CONNECTED LIST 
    let name = this.state.name;
    let connectedRef = firebase.database().ref('.info/connected');

    localStorage.setItem('name', name);

    connectedRef.on('value', (snapshot) => {
      if (snapshot.val() === true) {
        // CONNECTED
        const con = listRef.child(name);  // DEFINE REFERENCE
        // DISCONNECT, REMOVE NAME FROM DB
        con.onDisconnect().remove();
        // ADD NAME TO DB AFTER CALLING DISCONNECT - IMPORTANT (if not it adds then delets straight away)
        con.set(true);   // ADD VALUE TO NAME INDEX/KEY (true)
      }
      // GET LIST FROM DB AND PUSH INTO OUR ARRAY IN THIS.STATE
      listRef.on("value", (snapshot) => {
        let users = [];
        snapshot.forEach((user) => {
          users.push({
            id: snapshot.key,
            name: snapshot.val()
          })
        });
        setList(users);
      });
      const setList = (users) => {
        this.setState({
          names: users[0].name
        })
        // console.log(this.state.names, users[0].name, Object.keys(users[0].name).length);
      }
    });
  }

  // PUSH MESSAGE TO DB THEN RESET THIS.STATE
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

    this.setState({ message: '' });
  }

  // THINK BTN CHANGING COLOUR OF TEXT 
  onPress = () => {
    if (this.state.font === 'black') {
      this.setState({ font: 'grey' });
    }
    else {
      this.setState({ font: 'black' });
    }
  }

  // DELETE LAST USER COMMENT 
  onDelete = () => {
    let userName = this.state.name;
    // console.log(userName);
    messageRef.orderByChild('name').equalTo(userName).limitToLast(1).once('child_added', function (snapshot) {
      snapshot.ref.remove();
    })
    this.refresh()
  }
  // REFRESH MESSAGE LIST AFTER DELETING LAST MESSAGE
  refresh = () => {
    const previousMessages = [];
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
 
// RENDER THE HTML
  render() {
    return <div className='container'>
    {/* title */}
    <div className='titleDiv'>
      <h1>React Message App</h1>
      {/* <p className='usersLoggedIn'>Logged in: </p> */}
      {
        Object.keys(this.state.names).map(item => {
          return (
            <p className='usersLoggedIn' key={item}>
              {(item === this.state.name ? ' ' : item + ' is logged in')}
            </p>
          )
        })
      }
    </div>

      {/* messages will be listed here */}
      < div className='messagesDiv' id='messagesDivId' >
        <ul>
          {/* List array is mapped through*/}
          {this.state.list.map(item => {
            return (
              <li className={(item.name === this.state.name ? 'right' : 'left')}
                style={{ color: this.state.font }}
                key={item.id}
                id={item.id}>
                {item.name}: {item.message}
              </li>
            )
          })}
        </ul>
      </div >

      {/* message text area and send button here  */}
      < div className='inputDiv' id='inputDivId' >
        <form onSubmit={this.submitHandler}>
          <input name="message"
            className='inputBox'
            id='messageInputBox'
            placeholder="Send message..."
            value={this.state.message}
            onChange={this.changeHandler}
            required />
          <button className='submit' type="submit">Send Message</button>
        </form>
      </div >

      {/* type nickname + button here  */}
      < div className='nicknameDiv' id='nameDivId' >
        <form onSubmit={this.setName}>
          <input name="name"
            className='inputBox'
            placeholder="Choose a unique nickname..."
            value={this.name}
            onChange={this.changeHandler}
            required />
          <button className='submit' type="submit">Confirm Nickname</button>
        </form>
      </div >

      {/*think, delete options*/}
      < div id='options' >
        <button id='think' className='button think' onClick={this.onPress}>Think...</button>
        <button id='delete' className='button delete' onClick={this.onDelete}>Delete last message</button>
      </div >

    </div >
  }
}

export default LandingPage;