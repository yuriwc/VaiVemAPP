import React from 'react';
import { Button, StyleSheet, Text, useColorScheme, View, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'

const handleGPSPermission = async () => {
    const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if(res === RESULTS.GRANTED)
        console.log('ok');
    else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        res2 === RESULTS.GRANTED ?
            console.log('ok agora')
        :
            console.log('nok agora')
    }
}

const requestGPSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permissão de GPS. VaiVem",
          message:
            "Nós precisamos de acesso ao GPS, para pesquisar " +
            "por usuários que estão próximos de você.",
          buttonNeutral: "Pergunte-me depois",
          buttonNegative: "Negar",
          buttonPositive: "Consentir"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use GPS");
      } else {
        console.log("GPS permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      };

    return(
        <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
            <View style={[backgroundStyle, styles.container]}>
                <Text style= {[{color: isDarkMode ? Colors.white : Colors.black}]}>Nós precisaremos de acesso à sua localização, para gerenciar sua comunidade</Text>
                <Button title='Conceder Localização' onPress={() => Platform.OS ==='ios' ? handleGPSPermission() :  requestGPSPermission()}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1
    },
    container :{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default App;