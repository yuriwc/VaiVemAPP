import React, {useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  useColorScheme,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {requestBook} from '../../src/Apis';

const App = ({route}: any) => {
  let data = route.params.data;
  const isDarkMode = useColorScheme() === 'dark';

  async function handleRequest() {
    let id = Number(await AsyncStorage.getItem('@iduser'));
    let response = await requestBook(id, data.id);
    if (response) {
      if (response.mensagem === 'Criado com sucesso') {
        Alert.alert('Livro Solicitado com sucesso');
      } else if (response === 'Você já fez uma solicitação para esse livro') {
        Alert.alert('Atenção', 'Você já solicitou esse livro');
      }
    }
  }

  useEffect(() => {}, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          {color: isDarkMode ? Colors.white : Colors.black},
          styles.font36,
        ]}>
        {data.nome}
      </Text>
      <View style={styles.subContainer}>
        <Image style={styles.imgStyle} source={{uri: data.foto}} />
        <View style={styles.infoContainer}>
          <Text>Autor: {data.autor}</Text>
          <Text>Editora: {data.editora}</Text>
          <Text>Ano: {data.ano}</Text>
          <Text>Este livro está a {data.distancia} de você</Text>
          <Text>Classificação: </Text>
        </View>
      </View>
      <View style={styles.flexWithPadding}>
        <Text style={styles.textMargin}>SINOPSE</Text>
      </View>

      <TouchableOpacity onPress={handleRequest}>
        <View style={styles.containerEmprestimo}>
          <Text style={styles.textEmprestimo}>Solicitar Empréstimo</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerEmprestimo: {
    width: '100%',
    display: 'flex',
    height: 70,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmprestimo: {color: 'white', fontWeight: 'bold', fontSize: 18},
  textMargin: {margin: 10},
  flexWithPadding: {flex: 1, padding: 20},
  container: {
    flex: 1,
    padding: 20,
  },
  font36: {
    fontSize: 36,
  },
  subContainer: {
    flexDirection: 'row',
    height: '38%',
    padding: 10,
  },
  imgStyle: {
    width: '52%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
  },
});

export default App;
