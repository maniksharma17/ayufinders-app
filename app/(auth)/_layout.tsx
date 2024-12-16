import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 1000
        }}
        >
          <Stack.Screen name='index' options={{headerShown: false}} />
          <Stack.Screen name='signup' options={{headerShown: false}} />
        </Stack>
      </ThemeProvider>
  );
}
