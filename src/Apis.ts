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

export async function postLivrosAPI(idlivro:string, latitude:number, longitude:number, idUser:number, nome:string, foto:string, autor:string, editora:string, descricao:string){
  if(!editora) editora = ''
  return axios.post(`${API_BASEURL}/livro`,{
      'qrcode': null, 'idlivroapi': idlivro, "disponivel": true, "latitude": latitude, 'longitude': longitude, "nome":nome, "idusuario": idUser, 'foto': foto, 'autor': autor, "editora":editora, "sinopse": descricao
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

export async function getLivrosByIdApi(idlivro:string, iduser:number){
  return axios.get(`${API_BASEURL}/getlivrobyidapi/${idlivro}/${iduser}`,{
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
  let dados = {"dist": dist, "lat": lat, "long": long, "idusuario":id}
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

export async function requestBook(idUser: number, idBook:number){
  let data = { idsolicitante: idUser, idlivro: idBook } 
  return axios.post(`${API_BASEURL}/solicitacoes`,data,{
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
      return error.response.data.mensagem;
    }
  })
}

export async function getAllBooksByUser(idUser: number){
  return axios.get(`${API_BASEURL}/livro/${idUser}`,{
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

export async function getSolicitacao(idLivro: number){

  return axios.get(`${API_BASEURL}/solicitacoesLivro/${idLivro}`, {
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

export async function deleteData(id:number){

  return axios.delete(`${API_BASEURL}/solicitacoesLivro/${id}`,{
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

export async function emprestarLivro(id:number){
  console.log(id)
    return axios.post(`${API_BASEURL}/aceitarSolicitacao/${id}`,null,{
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