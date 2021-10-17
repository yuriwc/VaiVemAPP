import axios from 'axios';
import { API_BASE, API_BASEURL, API_LOGIN, API_PASSWORD } from 'react-native-dotenv'


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
   return axios.get(`${API_BASEURL}/usuariostatus/${data}`, {
      auth:{
        "username": `${API_LOGIN}`,
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

export async function getLivrosProx(lat:number, long:number, dist:number, id: number){
  let dados = {"dist": 3, "lat": -12.711107, "long": -38.343671, "idusuario":id}
  console.log(dados);
  return axios.post(`${API_BASEURL}/livrosprox`,dados, {
    auth:{
      "username": `${API_LOGIN}`,
      "password": `${API_PASSWORD}`
    }
  }).then((response) => response.data)
  
  .catch((error) => {
    if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }
  })
}

export async function searchBooks(search:string){
  return axios.get('https://www.googleapis.com/books/v1/volumes',{
    params: {
      "key": `${API_BASE}`,
      "q":search
    }
  }).then((response) => response.data)
  .catch((error) => {
    if(error.response)
      console.log(error.response)
    else
      console.log(error);
  })
}