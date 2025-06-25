import axios from "axios";

const API=axios.create({
    baseURL:"https://sales-chatbot-backend.onrender.com",
})

export default API