import React, { useState } from 'react';
import { Button, StyleSheet, Text, useColorScheme, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { postUserAPI }from '../../src/Apis';
import DatePicker from 'react-native-date-picker'

const App = ({navigation}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isGPSAuthorized, setGPS] =  useState(false);
    const [date, setDate] = useState(new Date())
    const [position, setPosition] = useState({"latitude":0, "longitude":0})

    const handleGPSPermission = async () => {
      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if(res === RESULTS.GRANTED){
         setGPS(true);
         Geolocation.getCurrentPosition(info => 
          setPosition({latitude: info.coords.latitude, longitude: info.coords.longitude})
          );
      }
      else if (res === RESULTS.DENIED) {
          const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if(res2 === RESULTS.GRANTED){
            setGPS(true)
            Geolocation.getCurrentPosition(info => 
              setPosition({latitude: info.coords.latitude, longitude: info.coords.longitude})
            );
          }else
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
            Geolocation.getCurrentPosition(info => 
              setPosition({latitude: info.coords.latitude, longitude: info.coords.longitude})
              );
        } else {
          Alert.alert('Atenção','Precisamos do acesso à sua localização');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    function getLocation(){
      if(Platform.OS === 'ios')
        handleGPSPermission();
      else
        requestGPSPermission();
    }

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      };

      async function postUser(){
        let dateFinal = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getDate()}`
        let nome = await AsyncStorage.getItem('@name')
        let email = await AsyncStorage.getItem('@email')
        Geolocation.getCurrentPosition(info => setPosition({"latitude": info.coords.latitude, "longitude": info.coords.longitude}));
        let json = {
          "nome": nome,
          "dataNascimento": dateFinal,
          "email": email,
          "latitude": position.latitude,
          "longitude": position.longitude,
          "cidade": '',
          "urlimg":''
        }

        let response = await postUserAPI(json);
        let { mensagem } = response;
          if(mensagem == 'Criado com sucesso'){
            await AsyncStorage.setItem('@loggedIn','false');
            navigation.navigate('Homescreen');
          }
      }

    return(
        <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
            <View style={[backgroundStyle, styles.container]}>
              <MapView
                onPress={(data) => setPosition({latitude : data.nativeEvent.coordinate.latitude, longitude: data.nativeEvent.coordinate.longitude})}
                zoomEnabled={false}
                  initialRegion={{
                    latitude: -12.699438,
                    longitude: -38.295582,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                  }}
                  region={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                  }}
                  style={styles.map}
                >
                  <Marker
                    onDragEnd={(e)=>console.log(e)}
                    coordinate={{latitude: position.latitude, longitude: position.longitude}}
                  />
                </MapView>
                {!isGPSAuthorized ? <Button title='Conceder Localização' onPress={() => getLocation()}/> : null}
                <Text style= {[{color: isDarkMode ? Colors.white : Colors.black, marginTop: 150}]}>Por favor, informe a sua data de nascimento</Text>
                <DatePicker date={date} onDateChange={setDate} mode={"date"} locale="pt"/>
                {(position.latitude === 0 || position.longitude === 0) ? null : <Button title='Cadastrar Usuário' onPress={() => postUser()}/> }
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
    },
    map: {
      top: 0,
      width: '100%',
      height: '30%',
      position: 'relative',
    }
})

export default App;