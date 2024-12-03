import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms/user';
import { Colors } from '@/constants/Colors';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';

export default function QuizScreen() {
  const colorScheme = useColorScheme(); 
  const {dark} = useTheme()
  const user = useRecoilValue(userAtom);
  const router = useRouter();
  const [ quizTopics, setQuizTopics ] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/quiz/`)
        const data = response.data
        setQuizTopics(data.quizCategories)
      } catch(error){
        console.error(error)
      }
    } 
    fetchData()
  }, [])

  
  return (
    <ThemedView style={colorScheme==='dark' ? styles.darkContainer : styles.lightContainer}>
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.topicContainer}>
          {quizTopics.map((item: any) => (
            <TouchableOpacity 
            key={item._id}
            onPress={()=>{
              router.push(`/(quiz)/${item.name}/${item._id}`)
            }}
            style={[styles.topicStyle, dark? styles.topicStyleDark : styles.topicStyleLight]}>
              <ThemedText style={styles.topicText} key={item._id}>{item.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 0,
    backgroundColor: Colors.dark.background
  },
  lightContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 0,
    backgroundColor: Colors.light.background
  },
  scrollContainer: {
    paddingBottom: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  topicContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 0,
    backgroundColor: 'transparent'
  },
  topicStyle: {
    display: 'flex',
    borderBottomWidth: 1,
    padding: 10
  },
  topicText: {
    fontSize: 18
  },
  topicStyleLight: {
    borderColor: "#dedede"
  },
  topicStyleDark: {
    borderColor: "#404040"
  }
});


