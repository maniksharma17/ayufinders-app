import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TextInput, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemedView } from './ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 

export type ThemedInputBoxProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  label?: string,
  icon?: string,
  placeholder?: string,
  setState: (s: any)=>void,
  value: string
};

export const ThemedInputBox = React.memo(({
  style,
  lightColor,
  darkColor,
  label,
  icon,
  placeholder,
  value,
  setState,
  ...rest
}: ThemedInputBoxProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const {dark} = useTheme()

  return (
    <ThemedView style={styles.container}>
      {label? 
      <ThemedView style={styles.rowContainer}>
        {label=='Password'? <MaterialIcons name="password" size={16} color={color} />: 
        <Ionicons name={icon as any} size={16} color={color}></Ionicons>}
        <ThemedText style={styles.label}>{label}</ThemedText>
      </ThemedView>
      : <></>
      }

      {label=='Password'? 
        <TextInput 
          secureTextEntry={true}
          style={[{...styles.textInput,
            backgroundColor: dark? "#575656": "#ededed",
            color: dark? "#ffffff": "#000000"
          }, style]}
          placeholder={placeholder}
          onChangeText={(text: string)=>{setState(text)}}
          value={value}
          ></TextInput> 
        :
        <TextInput 
        style={[{...styles.textInput, 
          backgroundColor: dark? "#575656": "#ededed",
          color: dark? "#ffffff": "#000000"
        }, style]}
        placeholder={placeholder}
        placeholderTextColor={dark ? "#bfbfbf" : "#adadad"}
        onChangeText={(text: string)=>{setState(text)}}
        value={value}
        ></TextInput>
      }
      
    </ThemedView> 
  );
})

const styles = StyleSheet.create({
  textInput: {
    padding: 6,
    fontSize: 16,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 4,
    width: 'auto'
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: "center"
  },
  label: {
    fontSize: 14
  }
});
