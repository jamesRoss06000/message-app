import React, { Component } from 'react';

class LandingPage extends Component {
  constructor(props) {
    // When you pass props to super, the props get assigned to 'this'
    super(props);
    // this.state is the buildiing block of the data that gets used
    this.state = {
      message: '',
      name: '',
      list: []
    }
  }

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // component mounted means when component is injected into DOM tree
  componentDidMount() {
    //incorporating local storage so data survives a full browser restart
    // note: session storage saved data survives just a page refresh
    this.hydrateStateWithLocalStorage();
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page 
    window.addEventListener(
      // "beforeunload" means before leaving the current page
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  // unmount is a function called immediately before the component is ended/destroyed 
  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    // saves data to local storage if component successfully unmounts
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    // for loop through all items in state
    for (let key in this.state) {
      // if 'key' (our random id number) exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string (data saved) and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for loop through every item in React state to rewrite our list
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  updateInput(key, value) {
    // update react state with input data
    this.setState({
      [key]: value
    })
  }

  sendMessage() {
    const newMessage = {
      id: 1 + Math.random(),
      message: this.state.newMessage,
      name: 'You'
    }

    const list = [...this.state.list];

    list.push(newMessage);

    this.setState({
      list,
      newMessage: ''
    })
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
                key={item.id}>
                {item.name}: {item.message}
              </li>
            )
          })}
        </ul>
      </div>

      {/* message text area and send button here  */}
      <div className='inputDiv'>
        <form>
          <input type='text' className='input'
            value={this.message}
            onChange={e => this.updateInput('newMessage', e.target.value)}
          />
          <button className='btn btn-primary'
            onClick={() => this.sendMessage()}>Send</button>
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