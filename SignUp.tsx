import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/dist/Ionicons';

export function SignUp({navigation}) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Select Location");
  const [locations, setLocations] = useState(["Select Location"]);

  const ui = (
    <SafeAreaView style={styles2.main}>
      <StatusBar
        animated={true}
        backgroundColor="rgb(180, 180, 20)"
      />
      <Image source={{ uri: "http://10.0.2.2/manthra/resources/images/icon.png" }} style={styles2.mianLogo} />
      <Text style={styles2.mainLogoText}>Manthra</Text>
      <View style={styles2.headerView}>
        <Text style={styles2.headerText}>Sign Up</Text>
      </View>
      <View style={styles2.view1}>
        <View style={styles2.view2}>
          <TextInput autoCorrect={false} style={styles2.input2} maxLength={20} placeholder="First Name" onChangeText={setFirstName} />
          <TextInput autoCorrect={false} style={styles2.input2} maxLength={20} placeholder="Last Name" onChangeText={setLastName} />
        </View>
        <TextInput keyboardType="numeric" style={styles2.input} maxLength={10} placeholder="Mobile" onChangeText={setMobile} />
        <TextInput autoCorrect={false} style={styles2.input} maxLength={16} secureTextEntry={true} placeholder="Password" onChangeText={setPassword} />
        <SelectDropdown
          data={locations}
          search = {true}
          searchInputTxtColor = "black"
          searchPlaceHolder = "Search location"
          defaultValue = "Select Location"
          searchPlaceHolderColor = "black"
          renderSearchInputLeftIcon = {searchIcon}
          buttonStyle = {styles2.input}
          dropdownStyle = {styles2.dropdown}
          onSelect={assignLocation}
        />
        <TouchableOpacity style={[styles2.btn, styles2.btnWarning]} onPress={saveUser}>
          <Text style={styles2.btnText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles2.btn, styles2.btnDark]} onPress={goToSignIn}>
          <Text style={[styles2.btnText, styles2.btnTextWhite]}>Already User? Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function goToSignIn(){
    navigation.navigate("Sign In");
  }

  function searchIcon(){
    const icon = (
      <Icon name="search-outline" size={18} color="black" />
    );

    return icon;
  }

  function assignLocation(selectedItem) {
    setLocation(selectedItem);
  }

  function loadCountries() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        var locationResponseArray = request.responseText;
        setLocations(JSON.parse(locationResponseArray));
      }
    };
    request.open("GET", "http://10.0.2.2/manthra/loadCountries.php", true);
    request.send();
  }

  useEffect(loadCountries, []);

  function saveUser() {

    var form = new FormData();
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("mobile", mobile);
    form.append("password", password);
    form.append("location", location);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        var newUserResponseArray = JSON.parse(request.responseText);

        if (newUserResponseArray[0].errorMessage != null) {
          Alert.alert("Message", newUserResponseArray[0].errorMessage);
        } else {
          navigation.navigate("Sign In");
          Alert.alert("Message", "Sign Up successful");
        }
      }
    };
    request.open("POST", "http://10.0.2.2/manthra/saveUser.php", true);
    request.send(form);
  }

  return ui;
}

const styles2 = StyleSheet.create(
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
      fontSize: 26,
      color: "#080808",
      paddingTop: 20,
    },
    inputView: {
      width: "100%",
      paddingTop: 15,
    },
    inputText1: {
      fontSize: 20,
      color: "#080808",
      marginBottom: 8
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
    input2: {
      width: "48.5%",
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
    view2: {
      flexDirection: "row",
      width: "100%",
      paddingTop: 12,
      gap: 8,
    },
    btn: {
      width: "100%",
      paddingVertical: 10,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#0101003a",
      borderRadius: 25,
      flexDirection: "row",
      justifyContent: "center",
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
    },
    dropdown: {
      backgroundColor: "yellow",
      borderRadius: 15,
      color: "black",
    },
    dropdownBtn: {
      backgroundColor: "red",
    },
    searchInput: {
      padding: 15,
      color: "black",
      fontSize: 22,
    },
    searchPlaceHolder: {
      fontSize: 22,
      color: "black",
      opacity: 0.6,
    }
  }
);