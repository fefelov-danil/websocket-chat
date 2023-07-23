import {ChangeEvent, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {v1} from "uuid";

type MessageType = {
  id: string
  name: string
  message: string
}

const socket = io('http://localhost:3009');

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    socket.on('init-messages-pushed', (messages: MessageType[]) => {
      setMessages(messages)
    })

    socket.on('newMessage-pushed', (message: MessageType) => {
      setMessages(prev => {
        return [...prev, message]
      })
    })
  }, [])

  const textareaHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }

  const sendMessageHandler = () => {
    const newMessage = {id: v1(), name: 'Danil', message}

    socket.emit('client-message-sent', newMessage)
    setMessage('')
  }

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <span>{message.name}: </span>
          <span>{message.message}</span>
        </div>
      ))}
      <textarea onChange={textareaHandler} value={message}></textarea>
      <button onClick={sendMessageHandler}>Send</button>
    </div>
  )
}

export default App
