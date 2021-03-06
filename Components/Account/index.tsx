import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, useColorScheme, StyleSheet, Button, Alert, Image, Platform } from 'react-native';
import { getAllBooksByUser, emprestarLivro, meusEmprestimosFeitos, meusEmprestimosSolicitados, alterarEmprestimo } from '../../src/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import Chat from '../Chat';

import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getSolicitacao, deleteData } from '../../src/Apis';
import Moment from 'moment';


const Stack = createStackNavigator();

function MyStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Account" component={App} />
        <Stack.Screen name="Books" component={MyBooks} />
        <Stack.Screen name="Request" component={MyRequests}/>
        <Stack.Screen name="Settings" component={MySettings}/>
        <Stack.Screen name="Interno" component={InternView}/>
        <Stack.Screen name="InternoEmprestimo" component={InternEmprestimoView}/>
        <Stack.Screen name="Chat" component={Chat}/>
      </Stack.Navigator>
    );
  }
  
const App = () => {

    const [km, setKm] = useState(5);
    const [livros, setLivros] = useState([]) as any;
    const navigation = useNavigation();

    useEffect(() => {
        getDistancia();
    },[]);

    async function handleSave(){
        await AsyncStorage.setItem('@distancia', ''+km);
        Alert.alert('Salvo', 'Sua alteração foi salva com sucesso');
    }

    async function getDistancia(){
        let dist = await AsyncStorage.getItem('@distancia') as string;
        setKm(Number(dist));
    }

    function handleNavigateToMyBooks(){
        navigation.navigate('Books' as never)
    }

    function handleNavigateToMySettings(){
        navigation.navigate('Settings' as never)
    }

    async function getAllBookByUserEffect(){
        let id = Number(await AsyncStorage.getItem('@iduser'));
        let data = await getAllBooksByUser(id);
        setLivros(data.livros)
    }


    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    async function handleDelete(){
        let response = await deleteData(99);
    }
    return(
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between', backgroundColor: '#ffdab9',}}>
            <View>
                <View style={{padding: 15}}>
                    <Text style={[{color: isDarkMode ? Colors.black : Colors.black},styles.header]}>Minha Conta</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={{margin: 5}} onPress={handleNavigateToMySettings}>
                    <View style={{backgroundColor: '#BC4B4B', height: 170, width: 150, borderRadius: 40, padding: 15, justifyContent: 'center', }}>
                        <Text style={{color: 'white', fontSize: 15, textAlignVertical: 'center'}}>Meus Emprestimos</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 5}} onPress={handleNavigateToMyBooks}>
                <View style={{backgroundColor: '#528881', height: 170, width: 150, borderRadius: 40, padding: 15, justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 15, textAlignVertical: 'center'}}>Meus Livros</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 5}}>
                <View style={{backgroundColor: '#645188', height: 170, width: 150, borderRadius: 40, padding: 15, justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 15, textAlignVertical: 'center'}}>Minhas Solicitações</Text>
                    </View>
                </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={{height: '40%', alignContent:'center', alignItems: 'center' ,backgroundColor: 'white', borderTopLeftRadius: 70, borderTopRightRadius: 70,shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.32,
shadowRadius: 5.46,
elevation: 9,}}>
                <Text style={{marginTop: 50, padding: 10}}>Distância máxima para buscar os livros.</Text>
                <Text style={{fontSize: 20, color: 'blue'}}>{km} KM</Text>
                <Slider
                    style={{width: 200, height: 40}}
                    minimumValue={2}
                    maximumValue={40}
                    minimumTrackTintColor="#645188"
                    maximumTrackTintColor="#f1f1f1"
                    value={km}
                    onValueChange={(value) => setKm(Number(value.toFixed()))}
                />
                {Platform.OS == 'ios' ? 
                    <Button title="Salvar Alterações" onPress={handleSave}/>
                    :
                    <TouchableOpacity style={{padding: 10}} onPress={handleSave}>
                        <View>
                            <Text style={{color: 'blue', fontSize: 15}}>Salvar Alterações</Text>
                        </View>
                    </TouchableOpacity>
                }
                
                {Platform.OS == 'ios' ? 
                    <Button color='red' title="Desativar minha conta" onPress={handleSave}/>
                    :
                    <TouchableOpacity style={{padding: 10}} onPress={handleSave}>
                        <View>
                            <Text style={{color: 'red', fontSize: 15}}>DESATIVAR MINHA CONTA</Text>
                        </View>
                    </TouchableOpacity>
                }
                
            </View>
        </SafeAreaView>
    )
}

const MyBooks = () => {
    const [livros, setLivros] = useState([]) as any;
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation();

       async function getAllBookByUserEffect(){
        let id = Number(await AsyncStorage.getItem('@iduser'));
        let data = await getAllBooksByUser(id);
        setLivros(data.livros)
    }

    function getColor(data:any){
        if(data.contagem > 0)
            return 'red';
        else
            return 'white'
    }

    useEffect(() => {
        getAllBookByUserEffect();
    },[]);

    function handleClickOnBook(idLivro:never, image:never, nome:never){
        navigation.navigate('Interno' as never, {idLivro, image, nome } as never)
    }
    Moment.locale('pt-br')
    return(
        <SafeAreaView style={{backgroundColor: "#ffdab9", flex: 1}}>
            <View style={{padding: 20}}>
                <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Meus Livros</Text>
            </View>
            <View style={{padding: 25}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {livros.map((data:any, index:any) => (
                        <TouchableOpacity style={{marginBottom: 15}} key={index} onPress={() => handleClickOnBook(data.idlivro as never, data.foto as never, data.nome as never)}>
                            <View style={{backgroundColor: '#003366', height: 90, padding: 15, borderRadius: 16, justifyContent: 'center'}}>
                                <Text style={{color: 'white'}}>{data.nome}</Text>
                                <Text style={{color: 'white'}}>Quantidade de solicitações: {data.contagem}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
            )}

const MySettings = () => {

    const navigation = useNavigation();

    const [livros, setLivros] = useState([]) as any;
    const [emprestimosSolicitados, setEmprestimosSolicitados] = useState([]) as any;

    async function getBook(){
        let id = Number(await AsyncStorage.getItem('@iduser'));
        let response = await meusEmprestimosFeitos(id)
        setLivros(response.emprestimo)
        let anotherResponse = await meusEmprestimosSolicitados(id);
        setEmprestimosSolicitados(anotherResponse.emprestimo)
    }

    const isDarkMode = useColorScheme() === 'dark';

    async function handleClickOnBook(idLivro:any, nome:any, solicitante:any, realizacao:any, devolucao:any, idemprestimo:any, idconcedente:any){
        let id = Number(await AsyncStorage.getItem('@iduser'));
        navigation.navigate('InternoEmprestimo' as never, {id, nome, solicitante, realizacao, devolucao, idemprestimo, idconcedente } as never)
    }
    

    useEffect(() => {
        getBook()
    },[]);
    return(
        <SafeAreaView style={{backgroundColor: "#ffdab9", flex: 1}}>
            <View style={{flex: 1}}>
                <View>
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.black },{fontSize: 20, textAlign: "center"}]}>Meus empréstimos feitos</Text>
                </View>
                <View style={{padding: 25}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {livros.map((data:any, index:any) => (
                                <TouchableOpacity style={{marginBottom: 15}} key={index} onPress={() => handleClickOnBook(data.idlivro, data.nome, data.usuarioreceptor, data.realizacaoemprestimo, data.devolucaoemprestimo, data.idemprestimo, data.idusuarioconcedente)}>
                                    <View style={{backgroundColor: '#003366', height: 90, padding: 15, borderRadius: 16, justifyContent: 'space-around'}}>
                                        <Text style={{color: 'white'}}>{data.nome}</Text>
                                        <Text style={{color: 'white'}}>Data de Devolução: {Moment(data.datadevolucao).date()}/{Moment(data.datadevolucao).month()+1}/{Moment(data.datadevolucao).year()}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        
                    </ScrollView>
                </View>
            </View>
            <View style={{flex: 1}}>
                <View>
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.black },{fontSize: 20, textAlign: 'center'}]}>Meus empréstimos solicitados</Text>
                </View>
                <View style={{padding: 25}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {emprestimosSolicitados.map((data:any, index:any) => (
                                <TouchableOpacity style={{marginBottom: 15}} key={index} onPress={() => handleClickOnBook(data.idlivro, data.nome, data.usuarioreceptor, data.realizacaoemprestimo, data.devolucaoemprestimo, data.idemprestimo)}>
                                    <View style={{backgroundColor: '#003366', height: 90, padding: 15, borderRadius: 16, justifyContent: 'space-around'}}>
                                        <Text style={{color: 'white'}}>{data.nome}</Text>
                                        <Text style={{color: 'white'}}>Data de Devolução: {Moment(data.datadevolucao).date()}/{Moment(data.datadevolucao).month()+1}/{Moment(data.datadevolucao).year()}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
            )
}

const MyRequests = () => {
    return(
        <SafeAreaView>
           
        </SafeAreaView>
    )
}

const InternView = (props:any) => {
    const [informations, setInformation] = useState([]) as any;
    const isDarkMode = useColorScheme() === 'dark';
    async function getInformation(){
        let response = await getSolicitacao(props.route.params.idLivro);
        setInformation(response.livrosolicitacoes);        
    }

    async function solicitarEmprestimo(id: number){
        let response = await emprestarLivro(id)
    }

    async function handleEmprestar(id:number){
        Alert.alert('Confirmação','Tem certeza que deseja emprestar o livro? ', [{text:'Sim', onPress: () => solicitarEmprestimo(id) }, {text:'Não', onPress: () => null}])
    }

   useEffect(() => {
       getInformation();
   },[])

   Moment.locale('pt-br');
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffdab9', justifyContent: 'space-between'}}>
            <View>
                <View style={{padding: 20}}>
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>{props.route.params.nome}</Text>
                </View>
                <Image style={{width: '40%', height: 250, margin: 20}} source={{uri: props.route.params.image}} />
            </View>
            <View style={{backgroundColor: 'white', height: '30%', borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
            <ScrollView horizontal>
            {informations.map((data:any, index:number) => (
                <View key={index} style={{margin: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 30}}>
                    <Text style={{fontSize: 20, lineHeight: 50}}>{data.nomeusuario}</Text>
                    <Text>Data da Solicitação: {Moment(data.datasolicitacao).date()}/{Moment(data.datasolicitacao).month()+1}/{(Moment(data.datasolicitacao).year())}</Text>
                    

                    {Platform.OS == 'ios' ? 
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Button color="green" title="Emprestar" onPress={() => handleEmprestar(data.idsolicitacoes)}/>
                        <Button color="red" title="Rejeitar" onPress={() => null}/>
                    </View> : 
                    
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Button color="green" title="Emprestar" onPress={() => handleEmprestar(data.idsolicitacoes)}/>
                        <Button color="red" title="Rejeitar" onPress={() => null}/>
                    </View>       
                }
                </View>
            ))}
            </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const InternEmprestimoView = (props:any) => {
    const navigation = useNavigation();
    const isDarkMode = useColorScheme() === 'dark';

    async function handleDevolucao(){
        let json = {"devolucaoemprestimo": true}
        let response = await alterarEmprestimo(props.route.params.idemprestimo, json)
    }

    async function handlePostergar(){
        props.route.params.devolucao
    }

    async function handleEmprestar(){
        let json = {"realizacaoemprestimo": true}
        
        let response = await alterarEmprestimo(props.route.params.idemprestimo, json)
        
    }

    function handleToChat(id:any){

        navigation.navigate('Chat' as never, {idemprestimo: props.route.params.idemprestimo} as never)

    }

   useEffect(() => {
      
   },[])

   Moment.locale('pt-br');
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffdab9', justifyContent: 'space-between'}}>
            <View>
                <View style={{padding: 20}}>
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>{props.route.params.nome}</Text>
                </View>
                <Image style={{width: '40%', height: 250, margin: 20}} source={{uri: props.route.params.image}} />
            </View>
            <View style={{backgroundColor: 'white', height: '30%', borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
                <View style={{margin: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 30}}>
                    <Text style={{fontSize: 15, lineHeight: 50}}>{props.route.params.solicitante}</Text>
                    {props.route.params.realizacao && props.route.params.devolucao ? <Text>Empréstimo já concluído</Text>: null}
                    <Text onPress={() => handleToChat(1)}>Icone de Chat</Text>
                    {props.route.params.idlivro == props.route.params.idconcedente ? null : 
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            {(!props.route.params.realizacao && !props.route.params.devolucao) ?  <Button color="green" title="Realizei o empréstimo" onPress={handleEmprestar}/> : null}
                            {(props.route.params.realizacao && !props.route.params.devolucao) ?  <View><Button color="green" title="Recebi de volta" onPress={handleDevolucao}/><Button title="Postergar Devolução" onPress={() => null}/></View> : null}
                        </View>    
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    
    header: {
      fontSize: 36,
      marginTop: 48
    }
  });

export default MyStack;