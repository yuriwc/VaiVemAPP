import axios from 'axios';
import { API_BASEURL, API_LOGIN, API_PASSWORD } from 'react-native-dotenv'


export async function postUserAPI(data:any){
    return axios.post(`${API_BASEURL}/usuario`,{
        'nome': data.nome, 'dataNascimento': data.dataNascimento, 'email': data.email, 'latitude': data.latitude, 'longitude': data.longitude, 'cidade': data.cidade, 'urlimg': data.urlimg, 'idstatus': data.idstatus
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
          console.log(error.response.status);
          console.log(error.response.headers);
          return error.response.data;
        }})
}

export async function getUserApi(data:any){
    axios.get(`${API_BASEURL}/usuario/${data}`)
    .then((response) => response.data)
    .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }})
}

export async function deleteUser(data:string){
    axios.delete(`${API_BASEURL}/usuario/${data}`)
    .then((response) => response.data)
    .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }})
}

export async function getLivros(){
  return axios.get(`${API_BASEURL}/livro`,{
    auth:{
      "username" : `${API_LOGIN}`,
      "password": `${API_PASSWORD}`
    }
  })
  .then((response) => response.data)
  .catch(function (error){
    if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }
  })
}