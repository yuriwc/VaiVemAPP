import React from 'react';
import { Button, StyleSheet, Text, useColorScheme, View } from 'react-native';
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

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      };

    return(
        <SafeAreaView style={styles.container}>
            <View style={[backgroundStyle, styles.container]}>
                <Text>Nós precisaremos de acesso à sua localização, para gerenciar sua comunidade</Text>
                <Button title='Conceder Localização' onPress={() => handleGPSPermission()}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    }
})

export default App;