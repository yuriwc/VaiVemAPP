import React, { useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Platform,
  Image
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBook} from '../../src/image/index';
import { getUserApi } from '../../src/Apis';

const App = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([] as any);
  const [error, setError] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';
  

  useEffect(() => {
    configureGoogleSign();
  },[])

  async function signIn() {
    
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError(null);
      await AsyncStorage.setItem('@name', ''+userInfo.user.name);
      await AsyncStorage.setItem('@email', ''+userInfo.user.email);
      let response = await getUserApi(userInfo.user.email);

      if(response.mensagem == 'OK'){
        await AsyncStorage.setItem('@loggedIn','true');
        await AsyncStorage.setItem('@latitude',''+response.usuariostatus.latitude);
        await AsyncStorage.setItem('@longitude',''+response.usuariostatus.longitude);;
        await AsyncStorage.setItem('@iduser',''+response.usuariostatus.id);
        navigation.navigate('Homescreen');
      }
      else
        navigation.navigate('SignUp');

      

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

  async function configureGoogleSign() {
    if (Platform.OS === 'android') {
      await GoogleSignin.configure({
        webClientId: "806189079871-dk8lfs35ijanetu335mdvfgktuklgoe6.apps.googleusercontent.com",
        offlineAccess: true,
        
      })
    } else {
      await GoogleSignin.configure({
        webClientId: "806189079871-80vocopfrh3fh957drg6nr9dfgv3pdis.apps.googleusercontent.com",
        forceCodeForRefreshToken: true,
        offlineAccess: false
      })
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffdab9' : '#ffdab9'
  };

  return (
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={[backgroundStyle, styles.container]}>
            <Image source={ImageBook} style={{width: '100%', maxHeight: 400}}/>
            <Text
              style={[{color: isDarkMode ? Colors.white : Colors.black, fontSize: 15}]}
              >Seja bem vindo. Faça o login para continuar.</Text>
            <GoogleSigninButton 
                onPress={() => signIn()}
            />
          </View>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffdab9'
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  }
});

export default App;
