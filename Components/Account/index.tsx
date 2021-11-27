import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, useColorScheme, StyleSheet, Button, Alert, Image, Platform } from 'react-native';
import { getAllBooksByUser } from '../../src/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

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
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.white },styles.header]}>Minha Conta</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={{margin: 5}} onPress={handleNavigateToMySettings}>
                    <View style={{backgroundColor: '#BC4B4B', height: 170, width: 150, borderRadius: 40, padding: 15, justifyContent: 'center'}}>
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
            <View style={{height: '40%', alignContent:'center', alignItems: 'center' ,backgroundColor: 'white', borderTopLeftRadius: 70, borderTopRightRadius: 70}}>
                <Text style={{marginTop: 50, padding: 10}}>Distância máxima para buscar os livros.</Text>
                <Slider
                    style={{width: 200, height: 40}}
                    minimumValue={2}
                    maximumValue={40}
                    minimumTrackTintColor="#645188"
                    maximumTrackTintColor="#f1f1f1"
                    value={km}
                    onValueChange={(value) => setKm(Number(value.toFixed()))}
                />
                <Text style={{padding: 10}}>{km} KM</Text>
                <Button title="Salvar Alterações" onPress={handleSave}/>
                <Button color='red' title="Desativar minha conta" onPress={handleSave}/>
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

    const isDarkMode = useColorScheme() === 'dark';
    const [km, setKm] = useState(5);

    async function handleSave(){
        await AsyncStorage.setItem('@distancia', ''+km);
        Alert.alert('Salvo', 'Sua alteração foi salva com sucesso');
    }

    async function getDistancia(){
        let dist = await AsyncStorage.getItem('@distancia') as string;
        setKm(Number(dist));
    }

    useEffect(() => {
        getDistancia();
    },[]);
    return(
        <SafeAreaView style={{padding: 10}}>
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Minhas Configurações</Text>
            <Text style={{marginTop: 50, padding: 10}}>Por favor, delimite a distância máxima com que deseja buscar os livros.</Text>
            <Slider
                style={{width: 200, height: 40}}
                minimumValue={2}
                maximumValue={40}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={km}
                onValueChange={(value) => setKm(Number(value.toFixed()))}
            />
            <Text style={{padding: 10}}>{km} Quilometros de distância</Text>
            <Button title="Salvar Alterações" onPress={handleSave}/>
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
        console.log(response)
        setInformation(response.livrosolicitacoes);        
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
                <View key={index} style={{margin: 40}}>
                    <Text style={{fontSize: 20, lineHeight: 50}}>{data.nomeusuario}</Text>
                    <Text>Data da Solicitação: {Moment(data.datasolicitacao).date()}/{Moment(data.datasolicitacao).month()+1}/{(Moment(data.datasolicitacao).year())}</Text>
                    

                    {Platform.OS == 'ios' ? 
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Button color="green" title="Emprestar" onPress={() => null}/>
                        <Button color="red" title="Rejeitar" onPress={() => null}/>
                    </View> : 
                    
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Button color="green" title="Emprestar" onPress={() => null}/>
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

const styles = StyleSheet.create({
    
    header: {
      fontSize: 36,
      marginTop: 48
    }
  });

export default MyStack;