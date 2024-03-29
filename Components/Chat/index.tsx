/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {getMessageById, postMessage} from '../../src/Apis';

const App = (props: any) => {
  const socket = io('http://10.0.2.2:5001');
  socket.connect();

  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]) as any;
  const [name, setName] = useState('');
  const [user, setUser] = useState('Usuário Desconectado');

  async function getMessages() {
    const response = await getMessageById(props.route.params.idemprestimo);
    console.log(response.chatemprestimo);
    const messagesFromApi: {name: any; message: any}[] = [];
    response.chatemprestimo.forEach((message: any) => {
      console.log(message);
      messagesFromApi.push({
        name: message.nomeusuarioremet,
        message: message.mensagem,
      });
    });

    console.log('new', messagesFromApi);
    setMessages(messagesFromApi);
  }

  console.log(messages);

  useEffect(() => {
    getUser();
    getMessages();

    socket.on('connect', () => {
      socket.emit('join', {
        username: name,
        room: props.route.params.idemprestimo,
      });
      //socket.emit('leave', '110')
      setConnected(true);
    });

    socket.on('getMessage', msg => {
      setMessages((prevVal: any) => [...prevVal, msg]);
    });
  }, []);

  async function getUser() {
    let name = (await AsyncStorage.getItem('@name')) as string;
    setName(name);
  }

  async function handleSendMessage() {
    let idUser = (await AsyncStorage.getItem('@iduser')) as string;
    if (connected) {
      /* postMessage(
        Number(idUser),
        props.route.params.idemprestimo,
        message,
        props.route.params.idconcedente === Number(idUser)
          ? props.route.params.idsolicitante
          : props.route.params.idconcedente,
      ); */
      socket.emit('sentMessage', {
        room: props.route.params.idemprestimo,
        msg: {name: name, message: message},
      });
      //socket.emit('sentMessage', {name: name, message: message})
      //socket.emit('sentMessage', {room: '120', msg: {name: name, message}});
      setMessage('');
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#ffdab9',
      }}>
      <View
        style={{
          backgroundColor: '#ffdab9',
          height: '8%',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 20, fontWeight: '200'}}>{user}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          height: '86%',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}>
        <View>
          <ScrollView>
            <View style={{justifyContent: 'space-around'}}>
              {messages.map((msg: any, index: any) => {
                if (msg.name != name && msg.name != user) setUser(msg.name);
                if (msg.name == name)
                  return (
                    <View
                      key={index}
                      style={{padding: 10, flexDirection: 'row-reverse'}}>
                      <View
                        style={{
                          backgroundColor: '#b9ffda',
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 50,
                          borderBottomLeftRadius: 20,
                          borderBottomRightRadius: 0,
                          minHeight: 30,
                          justifyContent: 'center',
                          maxWidth: '50%',
                          alignContent: 'center',
                          padding: 10,
                        }}>
                        <Text style={{margin: 4}} key={index}>
                          {msg.message}
                        </Text>
                      </View>
                    </View>
                  );
                else
                  return (
                    <View
                      key={index}
                      style={{padding: 10, flexDirection: 'row'}}>
                      <View
                        style={{
                          backgroundColor: '#b9deff',
                          borderTopLeftRadius: 50,
                          borderTopRightRadius: 20,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 20,
                          minHeight: 30,
                          padding: 10,
                          maxWidth: '50%',
                        }}>
                        <Text
                          style={{margin: 4, textAlign: 'center'}}
                          key={index}>
                          {msg.message}
                        </Text>
                      </View>
                    </View>
                  );
              })}
            </View>
          </ScrollView>

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopWidth: 0.3,
              borderStyle: 'solid',
              borderColor: 'gray',
            }}>
            <TextInput
              value={message}
              onChangeText={value => setMessage(value)}
              style={{width: '90%', height: 40}}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Icon name={'send'} size={25} color={'red'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;
