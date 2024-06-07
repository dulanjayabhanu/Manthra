import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { Home } from "./Home";
import { Chat } from "./Chat";
import { Profile } from "./Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();

function App(){
  async function checkUser(){
    const user = await AsyncStorage.getItem("user");
    return user;
  }
    const ui = (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={checkUser !== null?"Home":"Sign In"}>
          <Stack.Screen name="Sign Up" component={SignUp} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
          <Stack.Screen name="Sign In" component={SignIn} options={{headerShown: false}}/>
          <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );

    return ui;

} 

export default App;