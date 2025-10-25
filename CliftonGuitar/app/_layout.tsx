import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return(

<Stack initialRouteName="splashart">

<Stack.Screen
    name="splashart"
    options={{
      headerShown: false,
    }}
  />

<Stack.Screen 
    name="(tabs)"
    options={{headerShown: false}}
  />
  <Stack.Screen 
    name="products"
    options={{
      headerShown: false,
    }}
  />

  <Stack.Screen 
    name="login"
    options={{
      headerShown: false,
    }}
  />

  <Stack.Screen 
    name="index"
    options={{
      headerShown: false,
    }}
  />

  <Stack.Screen
    name="signup"
    options={{
      headerShown: false,
    }}
  />

</Stack>




  
  ) 

 
}
