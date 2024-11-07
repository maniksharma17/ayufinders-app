import { Text, type TextProps, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

export type UserInfoItemProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  title: string,
  subtitle?: string,
  icon: string
};

export function UserInfoItem({
  style,
  lightColor,
  darkColor,
  title,
  subtitle,
  icon,
  ...rest
}: UserInfoItemProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <ThemedView style={styles.rowContainer}>
      <Ionicons size={20} name={icon as any} color={color}/>
      <ThemedView style={styles.columnContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </ThemedView> 
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
  subtitle: {
    fontSize: 13
  }
});
