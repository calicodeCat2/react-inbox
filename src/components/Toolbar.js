import React, { Component } from "react";

export default class Toolbar extends Component {
  
  render() {

    return (
      <div className="row toolbar">
        <div className="col-md-12">
          <p className="pull-right">
            <span className="badge badge">2</span>
            unread messages
          </p>

          <button className="btn btn-default" >
            <i 
            onClick={() => this.props.toolbarSelectorFunc()}
            className={`fa fa${this.props.toolbarSelectorAction()}-square-o`} />
          </button>

          <button className="btn btn-default"
            onClick={() => this.props.markAsReadFunc()}  
          >Mark As Read</button>

          <button className="btn btn-default"
          onClick={() => this.props.markAsUnReadFunc()}   
          >Mark As Unread</button>

          <select className="form-control label-select">
            <option>Apply label</option>
            <option value="dev">dev</option>
            <option value="personal">personal</option>
            <option value="gschool">gschool</option>
          </select>

          <select className="form-control label-select">
            <option>Remove label</option>
            <option value="dev">dev</option>
            <option value="personal">personal</option>
            <option value="gschool">gschool</option>
          </select>

          <button className="btn btn-default">
            <i className="fa fa-trash-o" />
          </button>
        </div>
      </div>
    );
  }
}
