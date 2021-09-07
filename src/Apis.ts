import axios from 'axios';
import { API_BASE, API_LOGIN, API_PASSWORD } from 'react-native-dotenv'


export function postUserAPI(data:any){
    axios.post(`${API_BASE}/usuario`,{
        'nome': data.nome, 'dataNascimento': data.dataNascimento, 'email': data.email, 'latitude': data.latitude, 'longitude': data.longitude, 'cidade': data.cidade, 'urlimg': data.urlimg
    },{
        auth:{
            "username" : `${API_LOGIN}`,
            "password": `${API_PASSWORD}`
        }
    })      
    .then((response) => response.data)
    .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }})
}

export function getUserApi(data:any){
    axios.get(`${API_BASE}/usuario/${data}`)
    .then((response) => response.data)
    .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }})
}