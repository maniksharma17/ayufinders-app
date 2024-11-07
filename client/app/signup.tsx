import { StyleSheet } from 'react-native';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInputBox } from '@/components/ThemedInputBox';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { userAtom } from '@/store/atoms/user';
import { useRouter } from 'expo-router'
import { useRecoilState } from 'recoil';

export default function TabTwoScreen() {
  const router = useRouter()
  const [ password, setPassword ] = useState("")
  const [ name, setName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ message, setMessage ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)
  const [ user, setUser ] = useRecoilState(userAtom)

  const handleSignup = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/user/signup`, {
        name,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;      
      console.log(data)
      if (!data.user) {
        setMessage(data.message);
        return;

      } else {
        setUser({
          name: data.user.name,
          email: data.user.email,
          userId: data.user._id,
          isLoggedIn: true
         })
         router.replace('/(tabs)/home');
      }
    } catch (error) {
      setMessage('Login failed. Please check your network connection and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false) 
      setEmail("")
      setPassword("")
      setName("")
    }
  };

  useEffect(() => {
    if(user.isLoggedIn) {
      router.replace('/(tabs)/home')
    }
  }, [user.isLoggedIn]);

  return (
    <ThemedView style={styles.container}>
    
      <ThemedView>
        <ThemedInputBox label='Name' setState={setName} icon='person-circle-outline' value={name}></ThemedInputBox>
        <ThemedInputBox label='Email' setState={setEmail} icon='mail-outline' value={email}></ThemedInputBox>
        <ThemedInputBox label='Password' setState={setPassword} icon='password' value={password}></ThemedInputBox>

        {(message!='')? 
        <ThemedView style={styles.messageStyle}>
          <MaterialIcons size={20} color={'red'} name='error'></MaterialIcons>
          <ThemedText>
            {message}
          </ThemedText>
        </ThemedView>
        : <></>
        }


        <ThemedButton title='Signup'
        isLoading={isLoading}
        onPress={handleSignup}
        ></ThemedButton>

        <ThemedText
        style={{
          marginTop: 20,
          margin: 'auto'
        }}
        onPress={()=>{
          router.push('/')
        }}
        >Already have an account? <ThemedText type='link'>Sign in</ThemedText></ThemedText>
        
      </ThemedView>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 36,
    gap: 1,
    flex: 1,
  },
  messageStyle: {
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  }
})
