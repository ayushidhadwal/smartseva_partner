import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constant/Colors';
import { BASE_URL } from './src/constant/base_url';
import { store } from './src/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

axios.defaults.baseURL = BASE_URL;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaProvider>
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <AppNavigator />
          </PaperProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;