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
  TouchableOpacity
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { searchBooks } from '../../src/Apis';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Buscar" component={App} />
      <Stack.Screen name="Detalhes" component={DetalheLivro} />
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
        <SafeAreaView>
        <ScrollView>
                {books.map((item:any, index:number) => (
                    <TouchableOpacity  key={index} style={{padding: 30}}>
                        <View>
                            <Image style={{height: 350, maxWidth: '80%'}} source={{uri: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail.replace("http", "https") : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg'}}/>
                            <Text>{item.volumeInfo.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
    </SafeAreaView>
    )}

    const styles = StyleSheet.create({
        container: {
          flex: 1
        },
        inner: {
          padding: 24,
          flex: 1,
          justifyContent: "space-around"
        },
        header: {
          fontSize: 36,
          marginBottom: 48
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