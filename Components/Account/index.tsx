import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, useColorScheme, StyleSheet, Button, Alert, Image } from 'react-native';
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
        <SafeAreaView style={{padding: 20}}>
            
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Minha Conta</Text>
            <TouchableOpacity style={{margin: 5}} onPress={handleNavigateToMySettings}>
                <View style={{backgroundColor: 'white', height: 70, padding: 15, justifyContent: 'center'}}>
                    <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>Meus Ajustes</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 5}} onPress={handleNavigateToMyBooks}>
                <View style={{backgroundColor: 'white', height: 70, padding: 15}}>
                    <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>Meus Livros</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 5}}>
                <View style={{backgroundColor: 'white', height: 70, padding: 15}}>
                    <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>Minhas Solicitações</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{margin: 5}} onPress={handleDelete}>
                <View style={{backgroundColor: 'white', height: 70, padding: 15}}>
                    <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>Excluir Minha Conta</Text>
                </View>
            </TouchableOpacity>
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
        <SafeAreaView>
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Meus Livros</Text>
            <View style={{padding: 10}}>
            {livros.map((data:any, index:any) => (
                <TouchableOpacity key={index} onPress={() => handleClickOnBook(data.idlivro as never, data.foto as never, data.nome as never)}>
                    <View style={{backgroundColor: getColor(data), height: 70, padding: 15}}>
                        <Text style={{color: 'black'}}>{data.nome}</Text>
                        <Text>Quantidade de solicitações: {data.contagem}</Text>
                    </View>
                </TouchableOpacity>
            ))}
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
        setInformation(response.livrosolicitacoes);
    }
   useEffect(() => {
       getInformation();
   },[])
    return(
        <SafeAreaView>
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>{props.route.params.nome}</Text>
            <Image style={{width: '40%', height: 250}} source={{uri: props.route.params.image}} />
            <ScrollView>
            {informations.map((data:any, index:number) => (
                <View key={index}>
                    <Text>{data.nomeusuario}</Text>
                    <Text>{data.emailusuario}</Text>
                    <Text>{data.datasolicitacao}</Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Button title="Emprestar" onPress={() => null}/>
                        <Button title="Rejeitar" onPress={() => null}/>
                    </View>
                </View>
            ))}
            </ScrollView>
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