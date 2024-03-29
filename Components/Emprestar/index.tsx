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
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {searchBooks} from '../../src/Apis';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {getLivrosByIdApi, postLivrosAPI} from '../../src/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Buscar" component={App} />
      <Stack.Screen name="Detalhes" component={DetalheLivro} />
      <Stack.Screen name="Interno" component={InternalBook} />
    </Stack.Navigator>
  );
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [searchData, setSearch] = useState('');

  function handleInput(event: any) {
    setSearch(event);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[backgroundStyle, styles.inner]}>
          <Text
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.header,
            ]}>
            Buscar Livro
          </Text>
          <TextInput
            onChangeText={handleInput}
            placeholder="Título do Livro, Autor, Editora..."
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.textInput,
            ]}
            placeholderTextColor={isDarkMode ? Colors.white : Colors.black}
          />
          <View style={styles.btnContainer}>
            {Platform.OS === 'ios' ? (
              <Button
                title="Pesquisar"
                onPress={() =>
                  navigation.navigate(
                    'Detalhes' as never,
                    {name: searchData} as never,
                  )
                }
              />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    'Detalhes' as never,
                    {name: searchData} as never,
                  )
                }>
                <View>
                  <Text style={styles.pesquisarText}>Pesquisar</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const DetalheLivro = (props: any) => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]) as any;

  useEffect(() => {
    async function search() {
      let value = await searchBooks(props.route.params.name);
      setBooks(value.items);
    }
    search();
  }, [props.route.params.name]);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.inner}>
      <ScrollView>
        <Text
          style={[
            {color: isDarkMode ? Colors.white : Colors.black},
            styles.header,
          ]}>
          Livros Encontrados
        </Text>
        {books.map((item: any, index: number) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Interno' as never, {book: item} as never)
            }
            key={index}
            style={styles.p20}>
            <View>
              <Image
                style={styles.miniImg}
                source={{
                  uri: item.volumeInfo.imageLinks
                    ? item.volumeInfo.imageLinks.thumbnail.replace(
                        'http',
                        'https',
                      )
                    : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg',
                }}
              />
              <Text>{item.volumeInfo.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const InternalBook = (props: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  async function verifyBook(idlivro: string, iduser: number) {
    let data = await getLivrosByIdApi(idlivro, iduser);
    if (data.livros.alreadyExists === true) {
      Alert.alert(
        'Atenção',
        'Você já tem esse livro cadastrado. Deseja inserir outro?',
        [
          {text: 'Sim', onPress: postBook},
          {text: 'Não', onPress: undefined},
        ],
      );
    } else {
      Alert.alert('Atenção', 'Deseja adicionar esse livro para emprestimo?', [
        {text: 'Sim', onPress: postBook},
        {text: 'Não', onPress: undefined},
      ]);
    }
  }

  async function postBook() {
    let latitude = (await AsyncStorage.getItem('@latitude')) as string;
    let longitude = (await AsyncStorage.getItem('@longitude')) as string;
    let id = await AsyncStorage.getItem('@iduser');
    await postLivrosAPI(
      props.route.params.book.id,
      Number(latitude),
      Number(longitude),
      Number(id),
      props.route.params.book.volumeInfo.title,
      props.route.params.book.volumeInfo.imageLinks
        ? props.route.params.book.volumeInfo.imageLinks.thumbnail.replace(
            'http',
            'https',
          )
        : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg',
      props.route.params.book.volumeInfo.authors,
      props.route.params.book.volumeInfo.publisher,
      props.route.params.book.volumeInfo.description,
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text
          style={[
            {color: isDarkMode ? Colors.white : Colors.black},
            styles.header,
          ]}>
          {props.route.params.book.volumeInfo.title}
        </Text>
        <View>
          <Image
            style={styles.containerImg}
            source={{
              uri: props.route.params.book.volumeInfo.imageLinks
                ? props.route.params.book.volumeInfo.imageLinks.thumbnail.replace(
                    'http',
                    'https',
                  )
                : 'https://m.media-amazon.com/images/I/51lwu3FTjGL.jpg',
            }}
          />
          <View style={styles.p20}>
            <Text>
              Autor/a(es/s): {props.route.params.book.volumeInfo.authors}
            </Text>
            <Text>Páginas: {props.route.params.book.volumeInfo.pageCount}</Text>
            <Text>
              Data de Públicação:{' '}
              {props.route.params.book.volumeInfo.publishedDate}
            </Text>
            <Text>
              Classificação:{' '}
              {props.route.params.book.volumeInfo.averageRating
                ? props.route.params.book.volumeInfo.averageRating
                : 'Não Disponível'}
            </Text>
            <Text style={styles.someText}>
              Descrição: {props.route.params.book.volumeInfo.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.p20}>
        <TouchableOpacity
          onPress={() => verifyBook(props.route.params.book.id, 99)}
          style={styles.btnEmprestar}>
          <View style={styles.containerEmprestar}>
            <Text style={styles.emprestarText}>Emprestar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inner: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 36,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    marginTop: 12,
  },
  emprestarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  containerEmprestar: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#003366',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEmprestar: {
    width: 100,
    height: 40,
  },
  p20: {
    padding: 20,
  },
  someText: {
    textAlign: 'justify',
    marginTop: 30,
  },
  containerImg: {
    height: 250,
    maxWidth: '50%',
    padding: 20,
    marginLeft: '5%',
  },
  miniImg: {
    height: 350,
    maxWidth: '80%',
  },
  pesquisarText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default MyStack;
