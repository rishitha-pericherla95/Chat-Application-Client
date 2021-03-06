import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import './Chat.css';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'https://chat-application-95.herokuapp.com/';
    useEffect(()=>{
        //getting the data given by user
        const {name, room} = queryString.parse(location.search);
        
        socket =  io(ENDPOINT);
        setRoom(room);
        setName(name);
        
        socket.emit('join',{name,room},(error)=>{
            if(error) {
                alert(error);
              }
        });     
    },[ENDPOINT,location.search]);
//handle message
    useEffect(()=>{
        socket.on("message",message =>{
           setMessages(messages=>[...messages,message]);
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[]);
    //useEffect hook takes place when location.search value changes
    //function for sending messages
    const sendMessage = (event) =>{
        event.preventDefault(); //to avoid default full broswer refresh
        if(message){
            socket.emit('sendMessage', message, ()=>setMessage(''));
        }
    }
    return(
        <div className="outerContainer">
        <div className="container">
                 <InfoBar room={room}/>
                 <Messages messages={messages} name={name} />
                 <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        <TextContainer users={users}/>
        </div> 

    );
}
export default Chat;