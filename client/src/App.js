import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat.js';

const socket = io.connect("http://localhost:3001"); /* Links frontend to the backend */

function App() {
  const [username, setUsername] = useState(""); /* Defines a state variable named 'username' and a state update function named 'setUsername' using the useState hook. The initial state of the 'username' variable is an empty string. */
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (  /* This is a ternary operator that conditionally renders one of two elements based on the value of the showChat state variable. */
        /* This will hide the showChat as it is false initially, and will only show it if it is true when the button is clicked as specified in the joinRoom function */
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input type="text" placeholder="Name" onChange={(event) => { setUsername(event.target.value) }} /> {/* Updates the username every time it changes when the button is clicked */}
          <input type="text" placeholder="Room ID" onChange={(event) => { setRoom(event.target.value) }} />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} /> /* socket, username, and room are passed as props (short for properties) to the Chat component */
      )}
    </div>
  );
}

export default App;
