import { StatusBar, } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';

import styled from "styled-components/native"
import "./global.css";
import RootNavigation from './src/screens/navigation/RootNavigation';
import useCachedResources from './hooks/useCachedResources';

export default function App() {

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete){
    return null;
  }

  return (
    <Container>
      <StatusBar style="auto"/>
      <RootNavigation />
    </Container>
  );
}

const Container = styled(View)`
flex: 1;
`
