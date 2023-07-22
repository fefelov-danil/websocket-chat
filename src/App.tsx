import {ChangeEvent, useEffect, useState} from "react";
import {io} from "socket.io-client";

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
  }, [])

  const textareaHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }

  const sendMessageHandler = () => {
    socket.emit('client-message-sent', message)
    setMessage('')
  }

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <span>{message.name}</span>
          <span>{message.message}</span>
        </div>
      ))}
      <textarea onChange={textareaHandler} value={message}></textarea>
      <button onClick={sendMessageHandler}>Send</button>
    </div>
  )
}

export default App
