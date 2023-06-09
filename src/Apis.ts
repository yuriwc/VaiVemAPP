import axios from 'axios';
import {
  API_BASE,
  API_BASEURL,
  API_LOGIN,
  API_PASSWORD,
} from 'react-native-dotenv';

export async function postUserAPI(data: any) {
  return axios
    .post(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/usuario`,
      {
        nome: data.nome,
        dataNascimento: data.dataNascimento,
        email: data.email,
        latitude: data.latitude,
        longitude: data.longitude,
        cidade: data.cidade,
        urlimg: data.urlimg,
        idstatus: data.idstatus,
      },
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.status);
        console.log(error.response.headers);
        return error.response.data;
      }
    });
}

export async function postLivrosAPI(
  idlivro: string,
  latitude: number,
  longitude: number,
  idUser: number,
  nome: string,
  foto: string,
  autor: string,
  editora: string,
  descricao: string,
) {
  if (!editora) editora = '';
  return axios
    .post(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/livro`,
      {
        qrcode: '',
        idlivroapi: idlivro,
        disponivel: true,
        latitude: latitude,
        longitude: longitude,
        nome: nome,
        idusuario: idUser,
        foto: foto,
        autor: autor,
        editora: editora,
        sinopse: descricao,
      },
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.status);
        console.log(error.response.headers);
        return error.response.data;
      }
    });
}

export async function getUserApi(data: any) {
  console.log(
    `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/usuariostatus/${data}`,
  );

  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/usuariostatus/${data}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function deleteUser(data: string) {
  axios
    .delete(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/usuario/${data}`,
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function getLivros() {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/livro`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function getLivrosByIdApi(idlivro: string, iduser: number) {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/getlivrobyidapi/${idlivro}/${iduser}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function getLivrosProx(
  lat: number,
  long: number,
  dist: number,
  id: number,
) {
  let dados = {dist: dist, lat: lat, long: long, idusuario: id};
  return axios
    .post(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/livrosprox`,
      dados,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)

    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function searchBooks(search: string) {
  return axios
    .get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        key: `AIzaSyDtxCHj0QSB0ZRZSIWeuhfmaiRNUg6QWYU`,
        q: search,
      },
    })
    .then(response => response.data)
    .catch(error => {
      if (error.response) console.log(error.response);
      else console.log(error);
    });
}

export async function requestBook(idUser: number, idBook: number) {
  let data = {idsolicitante: idUser, idlivro: idBook};
  return axios
    .post(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/solicitacoes`,
      data,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        return error.response.data.mensagem;
      }
    });
}

export async function getAllBooksByUser(idUser: number) {
  console.log(API_BASEURL);
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/livro/${idUser}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function getSolicitacao(idLivro: number) {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/solicitacoesLivro/${idLivro}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function deleteData(id: number) {
  return axios
    .delete(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/solicitacoesLivro/${id}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function emprestarLivro(id: number) {
  console.log(id);
  return axios
    .post(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/aceitarSolicitacao/${id}`,
      null,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function meusEmprestimosFeitos(id: number) {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/meusEmprestimos/${id}/0`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function meusEmprestimosSolicitados(id: number) {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/meusEmprestimos/0/${id}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function alterarEmprestimo(id: number, data: any) {
  return axios
    .put(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/emprestimo/${id}`,
      data,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function postMessage(
  idUser: number,
  idemprestimo: number,
  message: string,
  idconcedente: number,
) {
  console.log(idUser, idemprestimo, message, idconcedente);
  return axios
    .post(
      'https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/enviarMensagem',
      {
        idusuarioremet: idUser,
        idemprestimo: idemprestimo,
        mensagem: message,
        idusuariodest: idconcedente,
      },
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export async function getMessageById(id: number) {
  return axios
    .get(
      `https://728b-2804-29b8-51f3-4da-385a-2ccb-d0fa-7b55.ngrok-free.app/mensagensEmprestimo/${id}`,
      {
        auth: {
          username: `${API_LOGIN}`,
          password: `${API_PASSWORD}`,
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}
