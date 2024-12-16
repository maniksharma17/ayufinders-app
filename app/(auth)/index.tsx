import { StyleSheet } from 'react-native';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInputBox } from '@/components/ThemedInputBox';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'
import axios from "axios"
import { userAtom } from '@/store/atoms/user';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRecoilState } from 'recoil';

export default function () {
  const router = useRouter()
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ message, setMessage ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  const [ user, setUser ] = useRecoilState(userAtom)

  const handleLogin = async () => {
    setIsLoading(true)
    console.log(`${process.env.EXPO_PUBLIC_BASE_URL}/user/signin`)
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/user/signin`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;     
      
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
    }
  };

  useEffect(() => {
    setIsMounted(true);
    console.log(user)
  }, []);

  useEffect(() => {
    if(isMounted && user.isLoggedIn) {
      router.replace('/(tabs)/home')
    }
  }, [user.isLoggedIn, isMounted]);

  return (
    <ThemedView style={styles.container}>

      <ThemedView style={styles.headingContainer}>
        <ThemedText style={styles.headingStyle}>Signin</ThemedText>
      </ThemedView>
    
      <ThemedView>
        <ThemedInputBox style={styles.inputStyle} label='Email' icon='mail-outline' setState={setEmail} value={email}></ThemedInputBox>
        <ThemedInputBox style={styles.inputStyle} label='Password' icon='password' setState={setPassword} value={password}></ThemedInputBox>
        
        {(message!='')? 
        <ThemedView style={styles.messageStyle}>
          <MaterialIcons size={20} color={'red'} name='error'></MaterialIcons>
          <ThemedText>
            {message}
          </ThemedText>
        </ThemedView>
        : <></>
        }

        <ThemedButton title='Login'
        onPress={handleLogin}
        isLoading={isLoading}
        ></ThemedButton>
        
        
        <ThemedText
        onPress={()=>{
          router.navigate('/signup')
        }}
        style={{
          marginTop: 20,
          margin: 'auto'
        }}
        >No account? <ThemedText type='link'>Signup</ThemedText></ThemedText>
           

      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 30,
    gap: 1,
    flex: 1,
  },
  headingContainer: {
    display: "flex",
  },
  headingStyle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    padding: 20
  },
  inputStyle: {
    padding: 10,
    borderRadius: 8,
    fontSize: 18
  },
  messageStyle: {
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  }

})
