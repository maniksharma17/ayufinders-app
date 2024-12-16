import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import { ThemedInputBox } from '@/components/ThemedInputBox';

export default function QuizScreen() {
  const colorScheme = useColorScheme(); 
  const {dark} = useTheme()
  const router = useRouter();
  const [ quizTopics, setQuizTopics ] = useState<TopicType[]>([])
  const [ filteredTopics, setFilteredTopics ] = useState<TopicType[]>([])
  const [ filter, setFilter ] = useState("")

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/quiz/`)
        const data = response.data
        setQuizTopics(data.quizCategories)
        setFilteredTopics(data.quizCategories)
      } catch(error){
        console.error(error)
      }
    } 
    fetchData()
  }, [])

  useEffect(()=>{
    const filteredTopics = quizTopics.filter((topic: TopicType) => topic.name.toLowerCase().includes(filter.toLowerCase()))
    setFilteredTopics(filteredTopics)
  }, [filter, quizTopics])

  
  return (
    <ThemedView style={colorScheme==='dark' ? styles.darkContainer : styles.lightContainer}>
      <ThemedView style={styles.filterInputBoxContainer}>
        <ThemedInputBox label='Topic' icon='search-outline' setState={setFilter} value={filter}></ThemedInputBox>
      </ThemedView>
      
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.topicContainer}>
          {filteredTopics.map((item: any) => (
            <TouchableOpacity 
            key={item._id}
            onPress={()=>{
              router.push(`/(quiz)/${item?.name}/${item?._id}`)
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
  filterInputBoxContainer: {
    padding: 16
  },
  topicStyle: {
    display: 'flex',
    borderBottomWidth: 1,
    padding: 10
  },
  topicText: {
    fontSize: 15
  },
  topicStyleLight: {
    borderColor: "#dedede"
  },
  topicStyleDark: {
    borderColor: "#404040"
  }
});


type TopicType = {
  _id: string,
  name: string,
  description: string,
  questions: string[]
}