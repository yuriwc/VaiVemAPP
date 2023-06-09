import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  Button,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {
  getAllBooksByUser,
  emprestarLivro,
  meusEmprestimosFeitos,
  meusEmprestimosSolicitados,
  alterarEmprestimo,
} from '../../src/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import Chat from '../Chat';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {getSolicitacao} from '../../src/Apis';
import Moment from 'moment';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Account" component={App} />
      <Stack.Screen name="Books" component={MyBooks} />
      <Stack.Screen name="Request" component={MyRequests} />
      <Stack.Screen name="Settings" component={MySettings} />
      <Stack.Screen name="Interno" component={InternView} />
      <Stack.Screen name="InternoEmprestimo" component={InternEmprestimoView} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}

const App = () => {
  const [km, setKm] = useState(5);
  const navigation = useNavigation();

  useEffect(() => {
    getDistancia();
  }, []);

  async function handleSave() {
    await AsyncStorage.setItem('@distancia', '' + km);
    Alert.alert('Salvo', 'Sua alteração foi salva com sucesso');
  }

  async function getDistancia() {
    let dist = (await AsyncStorage.getItem('@distancia')) as string;
    setKm(Number(dist));
  }

  function handleNavigateToMyBooks() {
    navigation.navigate('Books' as never);
  }

  function handleNavigateToMySettings() {
    navigation.navigate('Settings' as never);
  }

  const isDarkMode = useColorScheme() === 'dark';

  /* async function handleDelete() {
    let response = await deleteData(99);
  } */
  return (
    <SafeAreaView style={styles.superContainer}>
      <View>
        <View style={styles.p10}>
          <Text
            style={[
              {color: isDarkMode ? Colors.black : Colors.black},
              styles.header,
            ]}>
            Minha Conta
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.margin5}
            onPress={handleNavigateToMySettings}>
            <View style={styles.meusEmprestimosContainer}>
              <Text style={styles.solicitacoesText}>Meus Emprestimos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.margin5}
            onPress={handleNavigateToMyBooks}>
            <View style={styles.meusLivrosContainer}>
              <Text style={styles.solicitacoesText}>Meus Livros</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.margin5}>
            <View style={styles.solicitacoesContainer}>
              <Text style={styles.solicitacoesText}>Minhas Solicitações</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.distanciaContainer}>
        <Text style={styles.distanciaText}>
          Distância máxima para buscar os livros.
        </Text>
        <Text style={styles.textBlue}>{km} KM</Text>
        <Slider
          style={styles.sliderConfigs}
          minimumValue={2}
          maximumValue={40}
          minimumTrackTintColor="#645188"
          maximumTrackTintColor="#f1f1f1"
          value={km}
          onValueChange={value => setKm(Number(value.toFixed()))}
        />
        {Platform.OS == 'ios' ? (
          <Button title="Salvar Alterações" onPress={handleSave} />
        ) : (
          <TouchableOpacity style={styles.p10} onPress={handleSave}>
            <View>
              <Text style={styles.textBlue}>Salvar Alterações</Text>
            </View>
          </TouchableOpacity>
        )}

        {Platform.OS === 'ios' ? (
          <Button
            color="red"
            title="Desativar minha conta"
            onPress={handleSave}
          />
        ) : (
          <TouchableOpacity style={styles.p10} onPress={handleSave}>
            <View>
              <Text style={styles.textRed}>DESATIVAR MINHA CONTA</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const MyBooks = () => {
  const [livros, setLivros] = useState([]) as any;
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  async function getAllBookByUserEffect() {
    let id = Number(await AsyncStorage.getItem('@iduser'));
    let data = await getAllBooksByUser(id);
    setLivros(data.livros);
  }

  useEffect(() => {
    getAllBookByUserEffect();
  }, []);

  function handleClickOnBook(idLivro: never, image: never, nome: never) {
    navigation.navigate('Interno' as never, {idLivro, image, nome} as never);
  }
  Moment.locale('pt-br');
  return (
    <SafeAreaView>
      <View style={styles.p20}>
        <Text
          style={[
            {color: isDarkMode ? Colors.white : Colors.black},
            styles.header,
          ]}>
          Meus Livros
        </Text>
      </View>
      <View style={styles.p20}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {livros.map((data: any, index: any) => (
            <TouchableOpacity
              style={styles.marginBottom15}
              key={index}
              onPress={() =>
                handleClickOnBook(
                  data.idlivro as never,
                  data.foto as never,
                  data.nome as never,
                )
              }>
              <View style={styles.superView}>
                <Text style={styles.textWhite}>{data.nome}</Text>
                <Text style={styles.textWhite}>
                  Quantidade de solicitações: {data.contagem}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const MySettings = () => {
  const navigation = useNavigation();

  const [livros, setLivros] = useState([]) as any;
  const [emprestimosSolicitados, setEmprestimosSolicitados] = useState(
    [],
  ) as any;

  async function getBook() {
    let id = Number(await AsyncStorage.getItem('@iduser'));
    let response = await meusEmprestimosFeitos(id);
    setLivros(response.emprestimo);
    let anotherResponse = await meusEmprestimosSolicitados(id);
    setEmprestimosSolicitados(anotherResponse.emprestimo);
  }

  const isDarkMode = useColorScheme() === 'dark';

  async function handleClickOnBook(
    nome: any,
    solicitante: any,
    realizacao: any,
    devolucao: any,
    idemprestimo: any,
    idconcedente: any,
    idreceptor: any,
  ) {
    let id = Number(await AsyncStorage.getItem('@iduser'));
    navigation.navigate(
      'InternoEmprestimo' as never,
      {
        id,
        nome,
        solicitante,
        realizacao,
        devolucao,
        idemprestimo,
        idconcedente,
        idreceptor,
      } as never,
    );
  }

  useEffect(() => {
    getBook();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <View>
          <Text
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.textCentered20,
            ]}>
            Meus empréstimos feitos
          </Text>
        </View>
        <View style={styles.p20}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {livros.map((data: any, index: any) => (
              <TouchableOpacity
                style={styles.marginBottom15}
                key={index}
                onPress={() => {
                  handleClickOnBook(
                    data.nome,
                    data.usuarioreceptor,
                    data.realizacaoemprestimo,
                    data.devolucaoemprestimo,
                    data.idemprestimo,
                    data.idusuarioconcedente,
                    data.idusuarioreceptor,
                  );
                }}>
                <View style={styles.devolucaoContainer}>
                  <Text style={styles.textWhite}>{data.nome}</Text>
                  <Text style={styles.textWhite}>
                    Data de Devolução: {Moment(data.datadevolucao).date()}/
                    {Moment(data.datadevolucao).month() + 1}/
                    {Moment(data.datadevolucao).year()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View>
        <View>
          <Text
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.textCentered20,
            ]}>
            Meus empréstimos solicitados
          </Text>
        </View>
        <View style={styles.p20}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {emprestimosSolicitados.map((data: any, index: any) => (
              <TouchableOpacity
                style={styles.marginBottom15}
                key={index}
                onPress={() =>
                  handleClickOnBook(
                    data.nome,
                    data.usuarioreceptor,
                    data.realizacaoemprestimo,
                    data.devolucaoemprestimo,
                    data.idemprestimo,
                    data.idusuarioconcedente,
                    data.idusuarioreceptor,
                  )
                }>
                <View style={styles.devolucaoContainer}>
                  <Text style={styles.textWhite}>{data.nome}</Text>
                  <Text style={styles.textWhite}>
                    Data de Devolução: {Moment(data.datadevolucao).date()}/
                    {Moment(data.datadevolucao).month() + 1}/
                    {Moment(data.datadevolucao).year()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const MyRequests = () => {
  return <SafeAreaView />;
};

const InternView = (props: any) => {
  const [informations, setInformation] = useState([]) as any;
  const isDarkMode = useColorScheme() === 'dark';

  async function solicitarEmprestimo(id: number) {
    await emprestarLivro(id);
  }

  async function handleEmprestar(id: number) {
    Alert.alert('Confirmação', 'Tem certeza que deseja emprestar o livro? ', [
      {text: 'Sim', onPress: () => solicitarEmprestimo(id)},
      {text: 'Não', onPress: () => null},
    ]);
  }

  useEffect(() => {
    async function getInformation() {
      let response = await getSolicitacao(props.route.params.idLivro);
      setInformation(response.livrosolicitacoes);
    }
    getInformation();
  }, [props.route.params.idLivro]);

  Moment.locale('pt-br');
  return (
    <SafeAreaView style={styles.internContainer}>
      <View>
        <View style={styles.p20}>
          <Text
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.header,
            ]}>
            {props.route.params.nome}
          </Text>
        </View>
        <Image
          style={styles.alertContainer}
          source={{uri: props.route.params.image}}
        />
      </View>
      <View style={styles.containerView}>
        <ScrollView horizontal>
          {informations.map((data: any, index: number) => (
            <View key={index} style={styles.informationsView}>
              <Text style={styles.textNomeUsuario}>{data.nomeusuario}</Text>
              <Text>
                Data da Solicitação: {Moment(data.datasolicitacao).date()}/
                {Moment(data.datasolicitacao).month() + 1}/
                {Moment(data.datasolicitacao).year()}
              </Text>

              {Platform.OS === 'ios' ? (
                <View style={styles.flexRow}>
                  <Button
                    color="green"
                    title="Emprestar"
                    onPress={() => handleEmprestar(data.idsolicitacoes)}
                  />
                  <Button color="red" title="Rejeitar" onPress={() => null} />
                </View>
              ) : (
                <View style={styles.flexRow}>
                  <Button
                    color="green"
                    title="Emprestar"
                    onPress={() => handleEmprestar(data.idsolicitacoes)}
                  />
                  <Button color="red" title="Rejeitar" onPress={() => null} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const InternEmprestimoView = (props: any) => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  async function handleDevolucao() {
    let json = {devolucaoemprestimo: true};
    await alterarEmprestimo(props.route.params.idemprestimo, json);
  }

  /* async function handlePostergar() {
    props.route.params.devolucao;
  } */

  async function handleEmprestar() {
    let json = {realizacaoemprestimo: true};

    await alterarEmprestimo(props.route.params.idemprestimo, json);
  }

  function handleToChat() {
    navigation.navigate(
      'Chat' as never,
      {
        idemprestimo: props.route.params.idemprestimo,
        idconcedente: props.route.params.idconcedente,
        idsolicitante: props.route.params.idreceptor,
      } as never,
    );
  }

  Moment.locale('pt-br');
  return (
    <SafeAreaView style={styles.containerSub}>
      <View>
        <View style={styles.p20}>
          <Text
            style={[
              {color: isDarkMode ? Colors.white : Colors.black},
              styles.header,
            ]}>
            {props.route.params.nome}
          </Text>
        </View>
        <Image
          style={styles.imgSolicitante}
          source={{uri: props.route.params.image}}
        />
      </View>
      <View style={styles.containerSolicitante}>
        <View style={styles.subContainerSolicitante}>
          <Text style={styles.textSolitante}>
            {props.route.params.solicitante}
          </Text>
          {props.route.params.realizacao && props.route.params.devolucao ? (
            <Text>Empréstimo já concluído</Text>
          ) : null}
          <Text onPress={() => handleToChat()}>Icone de Chat</Text>
          {props.route.params.idlivro ===
          props.route.params.idconcedente ? null : (
            <View style={styles.containerRealizei}>
              {!props.route.params.realizacao &&
              !props.route.params.devolucao ? (
                <Button
                  color="green"
                  title="Realizei o empréstimo"
                  onPress={handleEmprestar}
                />
              ) : null}
              {props.route.params.realizacao &&
              !props.route.params.devolucao ? (
                <View>
                  <Button
                    color="green"
                    title="Recebi de volta"
                    onPress={handleDevolucao}
                  />
                  <Button title="Postergar Devolução" onPress={() => null} />
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    marginTop: 48,
  },
  containerRealizei: {
    display: 'flex',
    flexDirection: 'row',
  },
  textSolitante: {fontSize: 15, lineHeight: 50},
  subContainerSolicitante: {
    margin: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  containerSolicitante: {
    backgroundColor: 'white',
    height: '30%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  imgSolicitante: {
    width: '40%',
    height: 250,
    margin: 20,
  },
  containerSub: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  p20: {
    padding: 20,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  textNomeUsuario: {
    fontSize: 20,
    lineHeight: 50,
  },
  informationsView: {
    margin: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  containerView: {
    backgroundColor: 'white',
    height: '30%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  alertContainer: {
    width: '40%',
    height: 250,
    margin: 20,
  },
  internContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  textWhite: {
    color: 'white',
  },
  devolucaoContainer: {
    backgroundColor: '#003366',
    height: 90,
    padding: 15,
    borderRadius: 16,
    justifyContent: 'space-around',
  },
  marginBottom15: {
    marginBottom: 15,
  },
  textCentered20: {
    fontSize: 20,
    textAlign: 'center',
  },
  superView: {
    backgroundColor: '#003366',
    height: 90,
    padding: 15,
    borderRadius: 16,
    justifyContent: 'center',
  },
  textRed: {
    color: 'red',
    fontSize: 15,
  },
  p10: {
    padding: 10,
  },
  textBlue: {
    color: 'blue',
    fontSize: 15,
  },
  sliderConfigs: {
    width: 200,
    height: 40,
  },
  distanciaText: {
    marginTop: 50,
    padding: 10,
  },
  distanciaContainer: {
    height: '40%',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  solicitacoesContainer: {
    backgroundColor: '#645188',
    height: 170,
    width: 150,
    borderRadius: 40,
    padding: 15,
    justifyContent: 'center',
  },
  solicitacoesText: {
    color: 'white',
    fontSize: 15,
    textAlignVertical: 'center',
  },
  meusLivrosContainer: {
    backgroundColor: '#528881',
    height: 170,
    width: 150,
    borderRadius: 40,
    padding: 15,
    justifyContent: 'center',
  },
  margin5: {
    margin: 5,
  },
  meusEmprestimosContainer: {
    backgroundColor: '#BC4B4B',
    height: 170,
    width: 150,
    borderRadius: 40,
    padding: 15,
    justifyContent: 'center',
  },
  superContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});

export default MyStack;
