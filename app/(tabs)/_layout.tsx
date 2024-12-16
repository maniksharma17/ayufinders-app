import { Tabs } from 'expo-router';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {dark} = useTheme()

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: dark? "#000":"#fff"
    }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
          tabBarHideOnKeyboard: true,
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: dark? 'black': 'white',
          },
          headerTintColor: dark? 'white': 'black',
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: 10,
            height: 68, 
            backgroundColor: dark? 'black': 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 0
          },
          
          animation: "none",
          
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarLabel: ({color}: any) => {
              return <ThemedText style={{color: color, fontSize: 10, fontWeight: 900}}>Home</ThemedText>
            },
            tabBarIcon: ({ color, focused }: any) => (
              <TabBarIcon name={focused ? 'home-sharp' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quiz"
          options={{
            title: 'Quiz',
            tabBarLabel: ({color}: any) => {
              return <ThemedText style={{color: color, fontSize: 10, fontWeight: 900}}>Quiz</ThemedText>
            },
            tabBarIcon: ({ color, focused }: any) => (
              <TabBarIcon name={focused ? 'bulb' : 'bulb-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarLabel: ({color}: any) => {
              return <ThemedText style={{color: color, fontSize: 10, fontWeight: 900}}>Account</ThemedText>
            },
            tabBarIcon: ({ color, focused }: any) => (
              <TabBarIcon name={focused ? 'person-circle-sharp' : 'person-circle-outline'} color={color} />
            ),
          }}
        />
        
      </Tabs>
    </SafeAreaView>
  );
}
