import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Homescreen from './Components/Home/Home';
import Sign from './Components/Home/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './Components/SignUp';

function Home() {
  const Stack = createNativeStackNavigator();
  const [Splash, setSplash] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    getCondition();
  }, []);

  async function getCondition() {
    let condition = await AsyncStorage.getItem('@loggedIn');
    if (condition === 'true') {
      setSplash(true);
      setLoaded(true);
    } else {
      setSplash(false);
      setLoaded(true);
    }
  }

  if (isLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          {...(Splash
            ? {initialRouteName: 'Homescreen'}
            : {initialRouteName: 'Login'})}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Sign} />
          <Stack.Screen name="Homescreen" component={Homescreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[backgroundStyle, styles.container]} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
