import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
const SignupPage = () => {
    const[username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [confirm,setConfirm]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate();

    const handleSignup= async(e)=>{
        e.preventDefault();
        console.log("Signup clicked ");

        if(!username || !password || !confirm){
            return setError("All fields are required.")
        }

        if(password!==confirm){
            return setError("Passwords do not match")
        }
        try{
          const res=await API.post("/signup",{
            username,
            password,
          })
          console.log(res.data);
          navigate('/')
          
        }catch(err){
          const msg=err.response?.data?.error || "Signup failed";
          setError(msg);
        }



    }




  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' >

        <form 
         onSubmit={handleSignup}
         className='bg-white p-6 rounded shadow-md w-80'
        >
            <h2 className='text-xl font-bold mb-4 text-center' >Login</h2>
            {error && <p className='text-red-600 text-sm mb-2' >{error}</p> }

            <input type="text"
              placeholder='Username'
              className='w-full p-2 border rounded mb-3'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}


             />

             <input type="password" 
             placeholder='Password'
             className='w-full p-2 border rounded mb-3'
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
             />

             <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded mb-4"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              />

              <button 
                type='submit'
                className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 '
                >Signup</button>







        </form>
      
    </div>
  )
}

export default SignupPage
