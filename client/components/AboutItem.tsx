import { Text, type TextProps, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

export type AboutItemProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  title: string,
  icon: string
};

export function AboutItem({
  style,
  lightColor,
  darkColor,
  title,
  icon,
  ...rest
}: AboutItemProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <ThemedView style={styles.rowContainer}>
      <Ionicons size={20} name={icon as any} color={color}/>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: 600
  },
});
