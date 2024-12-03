import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserInfoItem } from '@/components/UserInfoItem';
import { AboutItem } from '@/components/AboutItem';
import { useRouter } from 'expo-router';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store/atoms/user';
import { useEffect } from 'react';

export default function AccountScreen() {
  const router = useRouter()
  const [ user, setUser ] = useRecoilState(userAtom)

  useEffect(()=>{
    if(!user.isLoggedIn) router.replace('/')
  }, [])

  const logoutHandler = () => {
    setUser({
      name: null,
      email: null,
      userId: null,
      isLoggedIn: false
    })
    router.push('/')
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={250} name="person" style={styles.headerImage} />}>

      <ThemedText>Account</ThemedText>
      <UserInfoItem title='Name' subtitle={"Manik Sharma"} icon='person-circle-outline'></UserInfoItem>
      <UserInfoItem title='Email' subtitle={"manik@gmail.com"} icon='mail-outline'></UserInfoItem>
      <UserInfoItem title='Subscription' subtitle='Paid' icon='star'></UserInfoItem>

      <ThemedText>About</ThemedText>
      <AboutItem title='Help Center' icon='help-circle-outline'></AboutItem>
      <AboutItem title='Terms of use' icon='reader-outline'></AboutItem>
      <AboutItem title='Privacy policy' icon='close-circle-outline'></AboutItem>
      <AboutItem title='Licenses' icon='document-outline'></AboutItem>


      <TouchableOpacity
      onPress={logoutHandler}
      >
        <ThemedView style={{...styles.rowContainer, marginTop: 10}}>
          <Feather name="log-out" size={24} color="#c45454" />
          <ThemedText>Sign out</ThemedText>
        </ThemedView>
      </TouchableOpacity>
      
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -50,
    left: -25,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 18
  },
  buttonStyle: {
    padding: 2,

  }
});
