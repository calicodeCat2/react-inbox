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

  markChecked = async (id) => {
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

  // numMessagesSelected = () => this.state.messages.filter(message => message.selected).length
  
  toolbarSelectorAction = () => {
    let numMessagesSelected = this.state.messages.filter(message => message.selected).length
    let checkAction = 'fa-square-o'
    if (numMessagesSelected === this.state.messages.length) {
      checkAction = 'fa-check-square-o'
    } else if (numMessagesSelected === 0) {
      checkAction = ''
    } else {
      checkAction = 'fa-check-square-minus'
    }
    return checkAction
  }

  toolbarSelectorFunc = () => {
    let numMessagesSelected = this.state.messages.filter(message => message.selected).length
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

  disableReadButton = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    let readMessages = selectedMessages.map(message => message.read)
    return readMessages.includes(true) || readMessages.length === 0 ? 'disabled' : ''
  }

  disableUnReadButton = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    let UnReadMessages = selectedMessages.map(message => !message.read)
    return UnReadMessages.includes(true) || UnReadMessages.length === 0 ? 'disabled' : ''
  }
  
  disableLabelApplySelect = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    return selectedMessages === 0 ? 'disabled' : ''
  }

  disableLabelRemoveSelect = () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
      return selectedMessages === 0 ? 'disabled' : ''
  }
  
  applyLabel = (label) => {
    if (label === 'Apply Label') return
    let selectedMessages = this.state.message.filter(message => message.selected)
    this.setState( this.state.messages.concat(selectedMessages.map(message => {
      if (message.labels.includes(label)) return message
      message.labels.push(label)
      return message
    })))
    
  }
  
  removeLabel = (label) => {
    if (label === 'Remove Label') return
    let selectedMessages = this.state.message.filter(message => message.selected)

    this.setState( this.state.messages.concat(selectedMessages.map(message => {
      message.labels.splice(label, 1)
      return message
    })))

  }

  deleteMessage = () => {
        let newState = this.state.messages.filter(message => !message.selected);
        this.setState({ messages: newState })
  }

  disableDeleteButton = () => {
    let selectedMessages = this.state.message.filter(message => message.selected)
    let UnReadMessages = selectedMessages.map(message => {
      return message.selected ? false : true
    })
    return UnReadMessages.includes(false) || UnReadMessages.length === 0 ? 'disabled' : ''
  }




  render() {
    return (
      <div className="App container">
      <Toolbar
        messages={this.state.messages} 
        toolbarSelectorAction={this.toolbarSelectorAction}
        toolbarSelectorFunc={this.toolbarSelectorFunc}
        markAsReadFunc={this.markAsReadFunc}
        markAsUnReadFunc={this.markAsUnReadFunc}
        disableReadButton={this.disableReadButton}
        disableUnReadButton={this.disableUnReadButton}
        deleteMessage={this.deleteMessage}
        disableDeleteButton={this.disableDeleteButton}
        disableLabelApplySelect={this.disableLabelApplySelect}
        disableLabelRemoveSelect={this.disableLabelRemoveSelect}
        applyLabel={this.applyLabel}
        removeLabel={this.removeLabel}
       />
      <Messages
          messages={this.state.messages.sort((a, b) => a.id - b.id)}
          markStarred={this.markStarred}
          markRead={this.markRead}
          markChecked={this.markChecked}
          disableDeleteButton={this.disableDeleteButton}
        />
      </div>
    );
  }
}

export default App;
