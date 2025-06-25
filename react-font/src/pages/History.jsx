import React from 'react'
import { useNavigate } from 'react-router-dom'


const History = () => {
    const navigate=useNavigate();
    const history = JSON.parse(localStorage.getItem("chat")) || []
    return (
        <div className="min-h-screen bg-gray-100 p-6"  >
            <h2 className="text-xl font-bold mb-4"  >Chat History</h2>
            <div className='space-y-4' >
                {history.map((msg, index) => (
                    <div 
                    key={index}
                    className={`p-3 rounded shadow max-w-lg ${msg.sender===user ? "bg-blue-200 ml-auto": "bg-white"}`} 
                    >
                        <p className="font-medium">{msg.text}</p>
                        <span className="text-xs text-gray-500 block">
                            {new Date(msg.timestamp).toLocaleString()}
                        </span>
                    </div>
                ))}

            </div>

            <button
            onClick={()=>navigate('/chat')}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

            >Back to Chat</button>

        </div>
    )
}

export default History
