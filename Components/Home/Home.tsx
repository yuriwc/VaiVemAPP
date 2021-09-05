import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 



import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const myIcon = <Icon name="home" size={30} color="#900" />;

  useEffect(() => {
    getUser();
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

  return (
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[backgroundStyle, styles.container]}>
              <Text style={[{color: isDarkMode ? Colors.white : Colors.black }]}>
                Olá, {name}
              </Text>
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
      <Tab.Screen name="Emprestar" component={App} options={{tabBarIcon: ({focused, color, size}) => {
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
  }
});

export default MyTabs;
