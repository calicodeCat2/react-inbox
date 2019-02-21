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
  
  toolbarSelectorAction = () => {
    let numMessagesSelected = this.state.messages.filter(message => message.selected).length
    let checkAction = 'fa-square-o'
    if (numMessagesSelected === this.state.messages.length) {
      checkAction = ''
    } else if (numMessagesSelected === 0) {
      checkAction = 'fa-square-o'
    } else {
      checkAction = 'fa-check-square-minus'
    }
    console.log(checkAction);
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

  markAsReadFunc = async () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    let urlArray = selectedMessages.map(message => "http://localhost:8000/messages/" + message.id)
    let promiseArray = []
      for (let i = 0; i < urlArray.length; i++) {
        promiseArray.push(
           fetch(urlArray[i], {
            method: 'PATCH',
            body: JSON.stringify({read: true}),
            headers: {
              'Content-Type': 'application/json'
            }
          }))
        }
          Promise.all(promiseArray).then(()=> {
              this.setState(prevState => {
            return {
              messages: prevState.messages.reduce((acc, message) => {
                if (message.selected) {
                  return [...acc, {...message, read: true}]
                }
                return [...acc, message]
              }, [])
            }
          })
          })  
  }

  markAsUnReadFunc = async () => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    let urlArray = selectedMessages.map(message => "http://localhost:8000/messages/" + message.id)
    let promiseArray = []
      for (let i = 0; i < urlArray.length; i++) {
        promiseArray.push(
           fetch(urlArray[i], {
            method: 'PATCH',
            body: JSON.stringify({read: false}),
            headers: {
              'Content-Type': 'application/json'
            }
          }))
        }
          Promise.all(promiseArray).then(()=> {
              this.setState(prevState => {
            return {
              messages: prevState.messages.reduce((acc, message) => {
                if (message.selected) {
                  return [...acc, {...message, read: false}]
                }
                return [...acc, message]
              }, [])
            }
          })
          })  
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
  
  applyLabelFunc = async (label) => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
  // Need to map selectedMessages for Labels so new label can be appended?
    let urlArray = selectedMessages.map(message => {
      return {
        url: "http://localhost:8000/messages/" + message.id, labels: message.labels    
      }
    })
    let promiseArray = []
      for (let i = 0; i < urlArray.length; i++) {
        promiseArray.push(
           fetch(urlArray[i], {
            method: 'PATCH',
            body: JSON.stringify({labels: label}),
            headers: {
              'Content-Type': 'application/json'
            }
          }))
        }
          Promise.all(promiseArray).then(()=> {
              this.setState(prevState => {
            return {
              messages: prevState.messages.reduce((acc, message) => {
                if (message.selected && !message.labels.includes(label)) {
                  message.labels.push(label) 
                  return [...acc, {...message}]
                }
                return [...acc, message]
              }, [])
            }
          })
          })  
  }
  
  removeLabelFunc = async (label) => {
    let selectedMessages = this.state.messages.filter(message => message.selected)
    // let selectedLabels = this.state.selectedMessages.map(messageLabel => messageLabel !== label)
    let urlArray = selectedMessages.map(message => {
      return {
        url: "http://localhost:8000/messages/" + message.id, labels: message.labels
      }
    })
    let promiseArray = []
      for (let i = 0; i < urlArray.length; i++) {
        promiseArray.push(
           fetch(urlArray[i], {
            method: 'PATCH',
            body: JSON.stringify({labels: !label}),
            headers: {
              'Content-Type': 'application/json'
            }
          }))
          Promise.all(promiseArray).then(()=> {
              this.setState(prevState => {
            return {
              messages: prevState.messages.reduce((acc, message) => {
                if (message.selected) {
                  message.labels = message.labels.filter(remLabel => remLabel !== label)
                  return [...acc, {...message}]
                }
                return [...acc, message]
              }, [])
            }
          })
          })  
    }
  }

  deleteMessage = () => {
        let newState = this.state.messages.filter(message => !message.selected);
        this.setState({ messages: newState })
  }

deleteMessage = async (message) => {
  let unSelectedMessages = this.state.messages.filter(message => message.selected);
  let urlArray = unSelectedMessages.map(message => {
    return {
      url: "http://localhost:8000/messages/" + message.id
    }
  })
  let promiseArray = [];
  for (let i = 0; i < urlArray.length; i++) {
    promiseArray.push(
     fetch( urlArray[i], {
       method: "DELETE",
       body: JSON.stringify({message: message}),
       header: {
         "Content-Type": "application/json"
       }
     }))
     Promise.all(promiseArray).then(() => {
     this.setState(prevState => {
       return {
         messages: prevState.messages.reduce((acc, message) => {
           if (message.selected) {
             return [...acc, {...message}]
           }
          return [...acc, message]
         }, [])
       }
     })
    })
  }
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
        applyLabelFunc={this.applyLabelFunc}
        removeLabelFunc={this.removeLabelFunc}
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
