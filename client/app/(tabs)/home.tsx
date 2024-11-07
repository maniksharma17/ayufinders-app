import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router'
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms/user';
import { useEffect } from 'react';

export default function HomeScreen() {
  const user = useRecoilValue(userAtom)
  const router = useRouter()

  useEffect(()=>{
    if(!user.isLoggedIn) router.replace('/')
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/home-banner.jpeg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{color: "#e37b05"}}>Welcome to AyuFinders</ThemedText>
        <ThemedText>Your Ayurveda Learning Companion!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">An Overview</ThemedText>
        <ThemedText>Explore the world of Ayurveda and learn its ancient wisdom with ease. AyuAI helps you understand key concepts, principles, and texts, making Ayurveda accessible and engaging for students.</ThemedText>
      </ThemedView>

      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  
  headerImage: {
    height: 300,
    width: 420,
    top: 0,
    left: 0,
    position: 'absolute',
  },
});
