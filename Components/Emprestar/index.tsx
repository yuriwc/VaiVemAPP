import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
      <SafeAreaView style={[backgroundStyle, styles.safeContainer]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[backgroundStyle, styles.container]}>
              <Text style={[{color: isDarkMode ? Colors.white : Colors.black }]}>
                Olá
              </Text>
            </View>
          </SafeAreaView>
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
    },
})

export default App;