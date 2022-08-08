//todo: the name of the app is TWADDLE

import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';


const SOCKET = io('http://localhost:8000');

const SocketConnect = () => {
    const [isConnected, setIsConncted] = useState(SOCKET.connected);
    const [lastPong, setLastPong] = useState(null);
    const [twads, setTwads] = useState([]);
    const [chatTwad, setChatTwad] = useState("");
    
    
    useEffect(() => {
        SOCKET.on("connect", () => {
            setIsConncted(true);
        })
        
        SOCKET.on("disconnected", () => {
            setIsConncted(false);
        })
        
        SOCKET.on("pong", () => {
            setLastPong(new Date.toISOString());
        })
        
        //!this is to disconnect if the server is not connected anymore
        return () => {
           SOCKET.off("connect")
           SOCKET.off("disconnect")
           SOCKET.off("pong")
        }
    }, [])
    
    SOCKET.on("twad packet", (nwTwad) => {
        setTwads([...twads, nwTwad]);
    })
    
    const sendTwad = () => {
        SOCKET.emit("a twad!");
    }
    
    
    const pushTwad = () => {
        SOCKET.emit("twad packet", chatTwad);
        setChatTwad("");
    }
  return (
    <div>
      <p>Connected: { '' + isConnected }</p>
      <p>Last pong: { lastPong || '-' }</p>
      <form action="">
        <input type="text" onChange={e => setChatTwad(e.target.value)} placeholder="send a twad ;)"/>
        <input type="button" value="send" onClick={pushTwad} />
      </form>
      <button onClick={ sendTwad }>Send ping</button>
      <ul>
        {
            twads.map((twad, i) => {
                return (
                    <li key={i}>{twad}</li>
                )
            })
        }
      </ul>
    </div>
  )
}

export default SocketConnect;