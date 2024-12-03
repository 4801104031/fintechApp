import { StatusBar, } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';

import styled from "styled-components/native"
import "./global.css";
import RootNavigation from './src/screens/navigation/RootNavigation';
import useCachedResources from './hooks/useCachedResources';
import { useUserStore } from './store/useUserStore';
import { useEffect } from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
export default function App() {

  const isLoadingComplete = useCachedResources();
  const queryClient = new QueryClient
  const {session, user} = useUserStore();

  useEffect( () => console.log(user,session), [user, session])

  if (!isLoadingComplete){
    return null;
  }

  return (
    <Container>
      <StatusBar style="auto"/>
      
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </Container>
  );
}

const Container = styled(View)`
flex: 1;
`
