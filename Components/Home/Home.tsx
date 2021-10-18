import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import Emprestar from '../Emprestar';
import SwipeCards from "react-native-swipe-cards-deck"
import { getLivros, getLivrosProx } from '../../src/Apis';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = useState('');
  const [coordenadas, setCoordenadas] = useState({latitude: 0, longitude: 0})
  const [email, setEmail] = useState('');
  const [livros, setLivros] = useState([]) as any;
  //const myIcon = <Icon name="home" size={30} color="#900" />;

  async function getAllLivros(){
    let value = await getLivros();
    setLivros(value.livros)
    return value.livros;
  }

  async function getLivrosProximos(){
    let latitude = await AsyncStorage.getItem('@latitude') as string;
    let longitude = await AsyncStorage.getItem('@longitude') as string;
    let id = await AsyncStorage.getItem('idUser');
    let livros = await getLivrosProx(Number(latitude),Number(longitude),3, 99);
    setLivros(livros.livros)
    console.log(livros.livros);
  }

  function distancia(lat1:number,long1:number,lat2:number,lon2:number){
    var pi = Math.PI;
    var acos = Math.acos;
    var cos = Math.cos;
    var sin = Math.sin;
    lat1 = lat1 * (pi/180);
    lat2 = lat2 * (pi/180);
    long1 = long1 * (pi/180);
    lon2= lon2 * (pi/180);
    var distancia = (6371 * acos(cos(lat1) * cos(lat2) * cos(lon2 - long1) + sin(lat1) * sin(lat2)));    
    return distancia;
  }

  useEffect(() => {
    getUser();
    getLivrosProximos();
  },[])
  
  async function getUser(){    
    let name = await AsyncStorage.getItem('@name') as string;
    let email = await AsyncStorage.getItem('@email') as string;
    setName(name);
    setEmail(email);
  }

 

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function Card({ data }) {
    return (
      <View style={[styles.card]}>
        <Text style={{color: isDarkMode ? Colors.white : Colors.black, backgroundColor: isDarkMode? Colors.darker : Colors.lighter, maxWidth: '90%'}}>{data.nome} | {data.autor} | Distância: {data.distancia}</Text>
        <Image style={{width: '90%', height: '90%'}} source={{uri: data.foto}} />
      </View>
    );
  }
  
  function StatusCard({ text }) {
    return (
      <View>
        <Text style={styles.cardsText}>{text}</Text>
      </View>
    );
  }

  function handleYup(card:any) {
    console.log(`Sim for ${card.text}`);
    return true; // return false if you wish to cancel the action
  }
  function handleNope(card:any) {
    console.log(`Nope for ${card.text}`);
    return true;
  }
  function handleMaybe(card:any) {
    console.log(`Maybe for ${card.text}`);
    return true;
  }
  
  
  let cards= [
    { text: "Tomato", backgroundColor: "red" },
    { text: "Aubergine", backgroundColor: "purple" },
    { text: "Courgette", backgroundColor: "green" },
    { text: "Blueberry", backgroundColor: "blue" },
    { text: "Umm...", backgroundColor: "cyan" },
    { text: "orange", backgroundColor: "orange" },
  ];

  return (
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[backgroundStyle, styles.container]}>
              <Text style={{color: isDarkMode ? Colors.white : Colors.black }}>
                Olá, {name}
              </Text>
              {livros ? (
                <SwipeCards
                  cards={livros}
                  renderCard={(cardData:any) => <Card data={cardData} />}
                  keyExtractor={(cardData:any) => String(cardData.id)}
                  renderNoMoreCards={() => <StatusCard text="Sem livros no momento..." />}
                  stack={true}
                  actions={{
                    nope: { onAction: handleNope },
                    yup: { onAction: handleYup },
                    maybe: { onAction: handleMaybe },
                  }}
                  hasMaybeAction={true}
                />
              ) : (
                <StatusCard text="Loading..." />
              )}
              <View style={{width: '100%', height: 60, backgroundColor: 'red', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>QTD. Livros: {livros.length}</Text>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Distância: 4km</Text>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Comunidade: 4</Text>
              </View>
            </View>
          </SafeAreaView>
  );
};

function MyTabs() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarStyle: {backgroundColor: isDarkMode ? Colors.black : Colors.white}}}>
      <Tab.Screen name="Ínicio" component={App} options={{tabBarIcon: ({focused, color, size}) => {
        let HomeIcon;
        HomeIcon = focused ? 'ios-home' : 'ios-home-outline';
        return <Icon name={HomeIcon} size={size} color={color}/>
      }}} />
      <Tab.Screen name="Emprestar" component={Emprestar} options={{tabBarIcon: ({focused, color, size}) => {
        let icon;
        icon = focused ? 'ios-wallet' : 'ios-wallet-outline';
        return <Icon name={icon} size={size} color={color}/>
      }}} />
      <Tab.Screen name="Minha Conta" component={App} options={{tabBarIcon: ({focused, color, size}) => {
        let Icon;
        Icon = focused ? 'account-convert' : 'account-convert-outline';
        return <AccountIcon name={Icon} size={size} color={color} />
      }}} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'red'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 450,
  },
  cardsText: {
    fontSize: 22,
  },
});

export default MyTabs;
