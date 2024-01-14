import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";

function App() {
  const [username, setUsername] = useState("username");

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const allMessages = [];

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher("a6b3d8da910729809d0e", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      // alert(JSON.stringify(data));
      allMessages.push(data);
      setMessages(allMessages);
      console.log(allMessages);
    });
  }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        message,
      }),
    });

    setMessage("");
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
          {/* <span >List group</span> */}
          <input
            className="fs-5 fw-semibold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message) => {
            return (
              <div className="list-group-item list-group-item-action py-3 lh-sm">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={(e) => submit(e)}>
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
