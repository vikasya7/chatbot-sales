import React from 'react'
import { useNavigate } from 'react-router-dom'
import Chatbot from '../components/Chatbot';

const ChatPage = () => {

    const navigate=useNavigate();

    const user=JSON.parse(localStorage.getItem("user"))

    const handleLogout=()=>{
        localStorage.removeItem("user")
        navigate('/')
    }
  return (
    <div className="flex flex-col h-screen"  >
        <div className=' bg-white shadow p-4 flex justify-between items-center flex-col gap-1 '>
             <h1 className="text-xl font-semibold">Welcome, {user?.username}</h1>
             <div className='w-full flex justify-end' >
              <button

               onClick={handleLogout}
               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
             >
               Logout
             </button>
             </div>

             

             <Chatbot/>



        </div>
      
    </div>
  )
}

export default ChatPage
