import React, { useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert
} from 'react-native';

import UserContext from '../Context/UserContext';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ( {navigation} ) => {
  const [userInfo, setUserInfo] = useState([] as any);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';
  

  useEffect(() => {
    configureGoogleSign();
  },[])

  const user = useContext(UserContext);
  
  async function getUser(){
    let value = await GoogleSignin.getCurrentUser();
  }

  async function signIn() {
    
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError(null);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('@loggedIn', 'true');
      await AsyncStorage.setItem('@name', ''+userInfo.user.name);
      await AsyncStorage.setItem('@email', ''+userInfo.user.email);
      navigation.navigate('Homescreen');

    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
        Alert.alert('Process Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        Alert.alert('Process in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        Alert.alert('Play services are not available');
      } else {
        // some other error
        Alert.alert('Something else went wrong... ', error.toString());
        setError(error);
      }
    }
  }

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId: "806189079871-80vocopfrh3fh957drg6nr9dfgv3pdis.apps.googleusercontent.com",
      offlineAccess: false
    });
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <UserContext.Provider value={{auth: isLoggedIn, user:userInfo}}>
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={[backgroundStyle, styles.container]}>
            <Text
              style={[{color: isDarkMode ? Colors.white : Colors.black,}]}
              >Seja bem vindo. Faça o login para continuar.</Text>
            <GoogleSigninButton 
                onPress={() => signIn()}
            />
          </View>
        </SafeAreaView>
    </UserContext.Provider>
  );
};

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

export default App;
