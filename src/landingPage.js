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

    // Add ourselves to presence list when online.
    let name = this.state.name;
    let names = this.state.names;
    let connectedRef = firebase.database().ref('.info/connected');

    let users = [];
    connectedRef.on('value', function (snap) {
      if (snap.val() === true) {
        // Connected
        const con = listRef.child(name);  //Here we define a Reference
        // On disconnect, remove this name
        con.onDisconnect().remove();
        // Add this name to the list of users AFTER calling disconnect or no good
        con.set(true);   //Here we write data (true) to the Database location corresponding to the Reference defined above 
      }

      // GET LIST OF USERS FROM DB
      listRef.on("value", function (snapshot) {
        users.push({
          id: 1 + Math.random(),
          name: snapshot.val()
        })
        console.log(users);
      });
    });
    this.setState({ names: users })
    console.log(users, names);
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

  render() {
    return <div className='container'>

      {/* title */}
      < div className='titleDiv' >
        <h1>React Message App</h1>
        <p className='usersLoggedIn'>Logged in: </p>
        {this.state.names.map(item => {
          return (
            <p className='usersLoggedIn' key={item.id}>
              {(item.name === this.state.name ? item.name : item.name)}
            </p>
          )
        })}
      </div >

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