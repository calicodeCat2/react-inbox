import React from "react";
import Message from "./Message";

export default function Messages({ messages, markStarred, markRead, markChecked }) {
  const eachMessage = messages.map(message => (
    <Message
      key={message.id}
      message={message}
      markStarred={markStarred}
      markRead={markRead}
      markChecked={markChecked}
    />
  ));

  return <div>{eachMessage}</div>;
}
