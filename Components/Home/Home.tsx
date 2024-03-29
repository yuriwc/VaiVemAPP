import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Emprestar from '../Emprestar';
import SwipeCards from 'react-native-swipe-cards-deck';
import {getLivrosProx} from '../../src/Apis';
import Details from './Details';
import Account from '../Account/index';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const App = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [km, setKm] = useState(5);
  const [livros, setLivros] = useState([]) as any;
  //const myIcon = <Icon name="home" size={30} color="#900" />;

  useEffect(() => {
    getDistancia();
    getLivrosProximos();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDistancia();
      getLivrosProximos();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  function handleClickonBook(data: any) {
    navigation.navigate('Details', {data});
  }

  async function getLivrosProximos() {
    let dist = (await AsyncStorage.getItem('@distancia')) as string;
    if (dist == null) {
      dist = '' + 5;
    }
    let latitude = (await AsyncStorage.getItem('@latitude')) as string;
    let longitude = (await AsyncStorage.getItem('@longitude')) as string;
    let id = Number(await AsyncStorage.getItem('@iduser'));
    let getLivrosNear = await getLivrosProx(
      Number(latitude),
      Number(longitude),
      Number(dist),
      id,
    );
    setLivros(getLivrosNear.livros);
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'white' : 'white',
  };

  function Card({data}: any) {
    return (
      <TouchableWithoutFeedback onLongPress={() => handleClickonBook(data)}>
        <View style={[styles.card]}>
          <Text style={styles.textName}>{data.nome}</Text>
          <Text style={styles.textDistancia}>Distância: {data.distancia}</Text>
          <Image style={styles.image90} source={{uri: data.foto}} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function StatusCard({text}: any) {
    return (
      <View>
        <Text style={styles.cardsText}>{text}</Text>
      </View>
    );
  }

  async function getDistancia() {
    let dist = (await AsyncStorage.getItem('@distancia')) as string;
    setKm(Number(dist));
  }

  function handleYup() {
    return true; // return false if you wish to cancel the action
  }
  function handleNope() {
    return true;
  }
  function handleMaybe() {
    return true;
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
      <View style={[backgroundStyle, styles.container]}>
        {livros ? (
          <SwipeCards
            cards={livros}
            loop={true}
            renderCard={(cardData: any) => <Card data={cardData} />}
            keyExtractor={(cardData: any) => String(cardData.id)}
            renderNoMoreCards={() => (
              <StatusCard text="Sem livros no momento..." />
            )}
            stack={true}
            actions={{
              nope: {show: false, onAction: handleNope},
              yup: {show: false, onAction: handleYup},
              maybe: {show: false, onAction: handleMaybe},
            }}
            hasMaybeAction={true}
          />
        ) : (
          <StatusCard text="Loading..." />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.textInfoContainer}>
            QTD. Livros: {livros.length}
          </Text>
          <Text style={styles.textInfoContainer}>Distância: {km} km</Text>
          <Text style={styles.textInfoContainer}>Comunidade: 4</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

function MyTabs() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
      }}>
      <Tab.Screen
        name="Ínicio"
        component={App}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            let HomeIcon;
            HomeIcon = focused ? 'ios-home' : 'ios-home-outline';
            return <Icon name={HomeIcon} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Emprestar"
        component={Emprestar}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            let icon;
            icon = focused ? 'ios-wallet' : 'ios-wallet-outline';
            return <Icon name={icon} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Minha Conta"
        component={Account}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            let newIcon;
            newIcon = focused ? 'account-convert' : 'account-convert-outline';
            return <AccountIcon name={newIcon} size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SlideHome" component={MyTabs} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 36,
    marginTop: 48,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 450,
  },
  cardsText: {
    fontSize: 22,
  },
  infoContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#003366',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInfoContainer: {
    color: 'white',
    fontWeight: 'bold',
  },
  textDistancia: {
    maxWidth: '90%',
    minWidth: '90%',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  textName: {
    backgroundColor: 'white',
    maxWidth: '90%',
    fontSize: 15,
    fontWeight: 'bold',
  },
  image90: {
    width: '90%',
    height: '90%',
  },
});

export default MyStack;
