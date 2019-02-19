import React, { Component } from "react";

export default class Message extends Component {

  render() {
    
    const { id, subject, read, starred, labels, selected } = this.props.message;
    const { markStarred, markRead, markChecked } = this.props;
    
    console.log("selected", selected, id);
    console.log("read" ,read, id);

    let labelNames = labels && labels.length
      ? labels.map(label => {
          return <span class="label label-warning">{label}</span>;
        })
      : null;


    return (
      <div className={`row message ${read ? "read" : "unread"} ${selected ? 'selected' : ''}`}>
        <div className="col-xs-1">
          <div className="row">
            <div className="col-xs-2" >
              <input type="checkbox"
              checked={`${selected ? "checked" : ""}`}
              onClick={ () => markChecked(id)} />
            </div>
            <div className="col-xs-2">
              <i className={`star fa fa-star${starred ? "" : "-o"}`}
                onClick={() => markStarred(this.props.message)}
              />
            </div>
          </div>
        </div>
        <div className="col-xs-11">
          {labelNames}
          <a href="#" onClick={() => markRead(id)}>
            {subject}
          </a>
        </div>
      </div>
    );
  }
}
