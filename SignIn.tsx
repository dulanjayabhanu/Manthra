import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SignIn({ navigation }) {

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const ui = (
    <SafeAreaView style={styles1.main}>
      <StatusBar
        animated={true}
        backgroundColor="rgb(180, 180, 20)"
      />
      <Image source={{ uri: "http://10.0.2.2/manthra/resources/images/icon.png" }} style={styles1.mianLogo} />
      <Text style={styles1.mainLogoText}>Manthra</Text>
      <View style={styles1.headerView}>
        <Text style={styles1.headerText}>Sign In</Text>
      </View>
      <View style={styles1.view1}>
        <TextInput keyboardType="numeric" style={styles1.input} maxLength={10} placeholder="Mobile" onChangeText={setMobile} value={mobile}/>
        <TextInput autoCorrect={false} style={styles1.input} maxLength={16} secureTextEntry={true} placeholder="Password" onChangeText={setPassword} value={password}/>

        <TouchableOpacity style={[styles1.btn, styles1.btnWarning]} onPress={userSignIn}>
          <Text style={styles1.btnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles1.btn, styles1.btnDark]} onPress={goToSignUp}>
          <Text style={[styles1.btnText, styles1.btnTextWhite]}>New User? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function goToSignUp() {
    navigation.navigate("Sign Up");
  }

  function userSignIn() {
    var form = new FormData();
    form.append("mobile", mobile);
    form.append("password", password);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        var newUserResponseObject = JSON.parse(request.responseText);

        if (newUserResponseObject.errorMessage != "") {
          Alert.alert("Message", newUserResponseObject.errorMessage);
        } else {
          async function clearStorage() {
            await AsyncStorage.removeItem("user");
          }
          async function saveStorage() {
            await AsyncStorage.setItem("user", JSON.stringify(newUserResponseObject.userDetails));
          }
          clearStorage();
          saveStorage();
          setMobile("");
          setPassword("");
          Alert.alert("Message", "Welcome " + newUserResponseObject.userDetails.first_name);
          navigation.navigate("Home");
        }
      }
    };
    request.open("POST", "http://10.0.2.2/manthra/userSignIn.php", true);
    request.send(form);
  }

  return ui;
}

const styles1 = StyleSheet.create(
  {
    main: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
      backgroundColor:"rgb(251, 255, 201)",
    },
    mianLogo: {
      width: 100,
      height: 100,
      borderRadius: 20,
    },
    mainLogoText: {
      color: "#080808",
      fontSize: 30,
      fontWeight: "bold",
      fontFamily: "Poppins",
      marginTop: 10,
    },
    headerView: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "flex-start",
    },
    headerText: {
      fontSize: 25,
      color: "#080808",
      paddingTop: 20,
      paddingBottom: 10,
    },
    inputView: {
      width: "100%",
      paddingTop: 15,
    },
    inputText1: {
      fontSize: 20,
      color: "#080808",
    },
    input: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "#0101003a",
      borderRadius: 25,
      paddingStart: 20,
      paddingEnd: 20,
      fontSize: 20,
      height:50,
      backgroundColor:"white",
    },
    view1: {
      width: "100%",
      paddingTop: 12,
      gap: 10,
    },
    btn: {
      width: "100%",
      paddingVertical: 10,
      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "#0101003a",
      borderRadius: 25,
      flexDirection: "row",
      justifyContent: "center",
      alignItems:"center",
      height:50,
    },
    btnWarning: {
      backgroundColor: "yellow",
    },
    btnDark: {
      backgroundColor: "#080808",
    },
    btnText: {
      color: "#080808",
      fontSize: 20,
      fontWeight: "bold",
    },
    btnTextWhite: {
      color: "#fff",
    }
  }
);