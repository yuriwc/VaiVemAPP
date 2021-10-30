import React, {useEffect, useState} from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  useColorScheme,
  View,
  Platform,
  Button,
  Keyboard,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { searchBooks } from '../../src/Apis';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getLivrosByIdApi, postLivrosAPI } from '../../src/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Buscar" component={App} />
      <Stack.Screen name="Detalhes" component={DetalheLivro} />
      <Stack.Screen name="Interno" component={InternalBook}/>
    </Stack.Navigator>
  );
}

const App = (props:any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [searchData, setSearch] = useState('');

  function handleInput(event:any){
      setSearch(event);
  }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[backgroundStyle, styles.inner]}>
        <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Buscar Livro</Text>
        <TextInput onChangeText={handleInput} placeholder="Título do Livro, Autor, Editora..." style={[{color: isDarkMode ? Colors.white : Colors.black}, styles.textInput]} placeholderTextColor={isDarkMode ? Colors.white : Colors.black}/>
        <View style={styles.btnContainer}>
          <Button title="Pesquisar" onPress={(props:any) => navigation.navigate('Detalhes' as never, {name: searchData} as never)} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
};

const DetalheLivro = (props:any) =>{

    const navigation = useNavigation();
    console.log(props.route.params);
    const [books, setBooks] = useState([]) as any;

    async function search(){
        let value = await searchBooks(props.route.params.name);
        console.log(value.items[0])
        setBooks(value.items)
      }

    useEffect(() => {
        search();
    },[]);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    


    return (
        <SafeAreaView style={styles.inner}>
        <ScrollView>
            <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>Livros Encontrados</Text>
                {books.map((item:any, index:number) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Interno' as never, {book: item} as never)}  key={index} style={{padding: 30}}>
                        <View>
                            <Image style={{height: 350, maxWidth: '80%'}} source={{uri: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail.replace("http", "https") : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg'}}/>
                            <Text>{item.volumeInfo.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
    </SafeAreaView>
    )}

    const InternalBook = (props:any) => {
        const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    async function verifyBook(idlivro:string, iduser:number){
        let data = await getLivrosByIdApi(idlivro, iduser);
        if(data.livros.alreadyExists == true)
            Alert.alert('Atenção','Você já tem esse livro cadastrado. Deseja inserir outro?',[{text: "Sim", onPress:postBook}, {text: "Não", onPress: undefined}])
        else
            Alert.alert('Atenção','Deseja adicionar esse livro para emprestimo?',[{text: "Sim", onPress:postBook}, {text: "Não", onPress: undefined}])
        }

      async function postBook(){
        let latitude = await AsyncStorage.getItem('@latitude') as string;
        let longitude = await AsyncStorage.getItem('@longitude') as string;
        let id = await AsyncStorage.getItem('@iduser');
        let value = await postLivrosAPI(props.route.params.book.id,Number(latitude), Number(longitude),Number(id),props.route.params.book.volumeInfo.title,props.route.params.book.volumeInfo.imageLinks ? props.route.params.book.volumeInfo.imageLinks.thumbnail.replace("http", "https") : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg',props.route.params.book.volumeInfo.authors,props.route.params.book.volumeInfo.publisher)
        console.log(value);
    }
        
        return(
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={[{color: isDarkMode ? Colors.white : Colors.black },styles.header]}>{props.route.params.book.volumeInfo.title}</Text>
                    <View>
                      <Image style={{height: 250, maxWidth: '50%', padding: 20, marginLeft: '5%'}} source={{uri: props.route.params.book.volumeInfo.imageLinks ? props.route.params.book.volumeInfo.imageLinks.thumbnail.replace("http", "https") : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg'}}/>
                        <View style={{padding: 20}}>
                            <Text>Autor/a(es/s): {props.route.params.book.volumeInfo.authors}</Text>
                            <Text>Páginas: {props.route.params.book.volumeInfo.pageCount}</Text>
                            <Text>Data de Públicação: {props.route.params.book.volumeInfo.publishedDate}</Text>
                            <Text>Classificação: {props.route.params.book.volumeInfo.averageRating ? props.route.params.book.volumeInfo.averageRating : 'Não Disponível' }</Text>
                            <Text style={{textAlign: 'justify', marginTop: 30}}>Descrição: {props.route.params.book.volumeInfo.description}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{padding: 20}}>
                  <TouchableOpacity onPress={() => verifyBook(props.route.params.book.id,99)} style={{width: 100, height: 40}}>
                      <View style={{width: 100, height: 40, borderRadius: 10, backgroundColor: '#003366', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: 'white', fontWeight: 'bold'}}>Emprestar</Text>
                      </View>
                  </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: '#ffdab9'
        },
        inner: {
          padding: 10,
          flex: 1,
          justifyContent: "space-around",
          backgroundColor: '#ffdab9'
        },
        header: {
          fontSize: 36,
        },
        textInput: {
          height: 40,
          borderColor: "#000000",
          borderBottomWidth: 1,
          marginBottom: 36
        },
        btnContainer: {
          marginTop: 12
        }
      });

export default MyStack;