import axios from 'axios';


const apollo = axios.create({
  baseURL: `http://localhost:${process.env.PORT}`,
})


export default apollo;
