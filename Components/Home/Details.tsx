import React, { useEffect } from 'react';
import { Text, View, Image, Alert, useColorScheme, SafeAreaView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  import { requestBook } from '../../src/Apis';

const App = ({ route, navigation }) => {
    let data = route.params.data;
    console.log(route);
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      };

      async function handleRequest(){
        let id = Number(await AsyncStorage.getItem('@iduser'));
        let response = await requestBook(id,data.id);
        if(response){
            if(response.mensagem == 'Criado com sucesso')
                Alert.alert('Livro Solicitado com sucesso')
            else if(response == 'Você já fez uma solicitação para esse livro')
                Alert.alert('Atenção', 'Você já solicitou esse livro');
        }
      }
    
    useEffect(() => {
        
    },[])
    return(
        <SafeAreaView style={{flex: 1, padding: 20, backgroundColor: '#ffdab9'}}>
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },{ fontSize: 36}]}>{data.nome}</Text>
            <View style={{flexDirection: 'row', height: '38%', padding: 10}}>
                <Image style={{width: '52%', height: '100%'}} source={{uri: data.foto}} />
                <View style={{flex: 1, padding: 20, justifyContent: 'space-evenly'}}>
                    <Text>Autor: {data.autor}</Text>
                    <Text>Editora: {data.editora}</Text>
                    <Text>Ano: {data.ano}</Text>
                    <Text>Este livro está a {data.distancia} de você</Text>
                    <Text>Classificação: </Text>
                </View>
            </View>
            <View style={{flex: 1, padding: 20}}>
                <Text style={{margin: 10}}>SINOPSE</Text>
            </View>
            
        <TouchableOpacity onPress={handleRequest}>
            <View style={{width: '100%', display:'flex', height: 70, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Solicitar Empréstimo</Text>
            </View>
        </TouchableOpacity>
        </SafeAreaView>  
    )
}

export default App;