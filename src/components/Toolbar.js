import React, { Component } from "react";

export default class Toolbar extends Component {

  handleMarkAsRead = () => {
    this.props.markAsReadFunc()
  }

  handleMarkAsUnRead = () => {
    this.props.markAsUnReadFunc()
    
  }

  handleDelete = () => {
    this.props.deleteMessage(this.props.message)    
  }

  render() {

    let unReadMessageBadge = this.props.messages.filter(message => !message.read).length
    return (
      <div className="row toolbar">
        <div className="col-md-12">
          <p className="pull-right">
            <span className="badge badge">{ unReadMessageBadge }</span>
            {unReadMessageBadge > 1 || unReadMessageBadge ? "unread messages" : "unread message"}
          </p>
{/*
          <button className="btn btn-default">
            <i
            onClick={() => this.props.toolbarSelectorFunc()}
            className={`fa fa${this.props.toolbarSelectorAction()}`} />
          </button>
*/}
          <button className="btn btn-default"
            onClick={this.handleMarkAsRead}
            // disabled={this.props.disableReadButton()}
            >Mark As Read</button>
            
            <button className="btn btn-default"
            onClick={this.handleMarkAsUnRead}   
            disabled={this.props.disableUnReadButton()}
          >Mark As Unread</button>

          <select className="form-control label-select" 
              disabled={this.props.disableLabelApplySelect}
              onChange={(e) => this.props.applyLabelFunc(e.target.value)}>
              <option>Apply label</option>
              <option value="dev">dev</option>
              <option value="personal">personal</option>
              <option value="gschool">gschool</option>
              </select>
              
              <select className="form-control label-select"
              disabled={this.props.disableLabelRemoveSelect()}
              onChange={(e) => this.props.removeLabelFunc(e.target.value)}>
            <option>Remove label</option>
            <option value="dev">dev</option>
            <option value="personal">personal</option>
            <option value="gschool">gschool</option>
          </select>

          <button className="btn btn-default"
            onClick={this.handleDelete}
            disabled={this.disableDeleteButton}>
            <i className="fa fa-trash-o" />
          </button>
        </div>
      </div>
    );
  }
}
