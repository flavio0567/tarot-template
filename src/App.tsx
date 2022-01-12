// App.js
import 'react-native-reanimated';

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from 'styled-components';
import {LogBox} from 'react-native';

import {Routes} from './shared/routes';
import AppProvider from './shared/hooks';
import SplashScreen from 'react-native-splash-screen';
import theme from './shared/global/theme';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
    LogBox.ignoreLogs(['EventEmitter.removeListener']);
  }, []);

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="dark-content" translucent />
        <AppProvider>
          <Routes />
        </AppProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
