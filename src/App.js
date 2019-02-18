import React, { Component } from "react";
import Toolbar from "./components/Toolbar";
import Messages from "./components/Messages";
import "./App.css";



class App extends Component {
  state = {
    messages: [],
    error: false,
    loading: false
  };

  componentDidMount = async () => {
    try {
      const res = await fetch("http://localhost:8000/messages");
      if (!res.ok) {
        throw new Error("Bad Api Res");
      }
      const json = await res.json();
      this.setState({
        messages: json
      });
    } catch (e) {
      console.log(e);
    }
  };

  markStarred = async (message) => {
    let { id } = message
    try {
      let theMessage = this.state.messages.filter(msg => msg.id == id)[0]
      const res = await fetch(`http://localhost:8000/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({starred: !theMessage.starred}),
        headers: {
          "content-type": "application/json"
        }
      })
      if (!res.ok) {
        throw new Error("Bogus API res")
      }
      this.setState(prevState => {
        return {
          messages: prevState.messages.reduce((acc, message) => {
            if (id === message.id) {
              return [...acc, {...message, starred: !message.starred}];
            }
              return [...acc, message]
          }, [])
        }
      })
    } catch(e) {
      console.error(e);
    } 
}

  markRead = async (id)  => {
    try {
      const res = await fetch(`http://localhost:8000/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({read: true}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        throw new Error('Bad Res From Api')
      }
        this.setState(prevState => {
          return {
            messages: prevState.messages.reduce((acc, message) => {
              if (message.id === id) {
                return [...acc, {...message, read: true}]
              }
              return [...acc, message]
            }, [])
          }
        })
    } catch (e) {
      alert(e)
    }
  }

  markChecked = async (message) => {
    let { id } = message
    try {
      let theMessage = this.state.messages.filter(msg => msg.id == id)[0]
      const res = await fetch(`http://localhost:8000/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({selected: !theMessage.selected}),
        headers: {
          "content-type": 'application/json'
        }
      })
      if (!res.ok) {
        throw new Error('No API Here')
      }
      this.setState(prevState => {
        return {
          messages: prevState.messages.reduce((acc, message) => {
            if (id === message.id) {
              return [...acc, {...message, selected: !message.selected}]
            }
            return [...acc, message]
          }, [])
        }
      })
    } catch(e) {
      console.error(e)
    }
  }

  toolbarSelectorAction = () => {
    let numMessagesSelected = () => this.state.messages.filter(message => {
      return message.selected
    }).length
    let checkAction = ''
    if (numMessagesSelected === this.state.messages.length) {
      checkAction = '-check'
    } else if (numMessagesSelected === 0) {
      checkAction = ''
    } else {
      checkAction = '-minus'
    }
    return checkAction
  }

  toolbarSelectorFunc = () => {
    let numMessagesSelected = () => this.state.messages.filter(message => {
      return message.selected
    }).length
      if(numMessagesSelected === this.state.messages.length) {
        this.setState({
          message: this.state.messages.map(message => {
            message.selected = false
            return message
          })
        })
      } else {
        this.setState({
          message: this.state.messages.map(message => {
            message.selected = true
            return message
          })
        })
      }
  }

  markAsReadFunc = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    this.setState(
      this.state.messages.concat(selectedMessages.map(message => {
        message.read = true
        return message
      })))
  }

  markAsUnReadFunc = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    this.setState(
      this.state.messages.concat(selectedMessages.map(message => {
        message.read = false
        return message
      })))
  }


  render() {
    return (
      <div className="App container">
      <Toolbar messages={this.state.messages} 
      toolbarSelectorAction={this.toolbarSelectorAction}
      toolbarSelectorFunc={this.toolbarSelectorFunc}
      markAsReadFunc={this.markAsReadFunc}
      markAsUnReadFunc={this.markAsUnReadFunc}
       />
      <Messages
          messages={this.state.messages.sort((a, b) => a.id - b.id)}
          markStarred={this.markStarred}
          markRead={this.markRead}
          markChecked={this.markChecked}
        />
      </div>
    );
  }
}

export default App;
