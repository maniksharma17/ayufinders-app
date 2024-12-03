import { Text, type TextProps, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  title: string,
  isLoading: boolean,
  type?: 'default' | 'outline' | 'link'
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  title,
  type="default",
  onPress,
  isLoading,
  ...rest
}: ThemedButtonProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TouchableOpacity style={{...styles.button, backgroundColor: color, opacity: isLoading? 50:100}} onPress={onPress} disabled={isLoading}>
      <ThemedText lightColor='#ffffff' darkColor='#000000' style={styles.text}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    marginTop: 10
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
});
