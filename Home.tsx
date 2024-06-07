import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, Pressable, StatusBar, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Modal from "react-native-modal";

export function Home({ navigation }) {

  const [user, setUser] = useState([]);
  const [searchUserValue, setSearchUserValue] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userProfileImageStatus, setUserProfileImageStatus] = useState("");

  async function loadUsers(text) {

    const userJSON = await AsyncStorage.getItem("user");
    const userId = JSON.parse(userJSON).id;

    var form = new FormData();
    form.append("userId", userId);
    form.append("text", text);

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        if (request.responseText != "no results") {
          var userResponseArray = JSON.parse(request.responseText);
          setUser(userResponseArray);

        }
      }
    };

    request.open("POST", "http://10.0.2.2/manthra/loadUsers.php", true);
    request.send(form);
  }

  function loadUserStart() {
    loadUsers("");
    // setInterval(loadUsers, 5000);
  }

  useEffect(loadUserStart, []);

  function searchUser(text) {
    setSearchUserValue(text);
    loadUsers(text);
  }

  const ui = (
    <SafeAreaView style={styles3.main}>
      <StatusBar
        animated={true}
        backgroundColor="rgb(180, 180, 20)"
      />
      <View style={styles3.headreView}>
        <Text style={styles3.headerText}>Manthra</Text>
        <Pressable style={styles3.userBtn} onPress={goToProfile}>
          <Icon name="person-circle-outline" size={35} color="black" />
        </Pressable>
      </View>
      <View style={styles3.searchView}>
        <TouchableOpacity style={styles3.friendListBtn}>
          <Icon name="chatbubbles-outline" size={22} color="black" />
          <Text style={styles3.friendListText}> Chat</Text>
        </TouchableOpacity>
        <TextInput style={styles3.input} placeholder="Search Friends" autoCorrect={true} maxLength={50} onChangeText={searchUser} />
      </View>
      <View style={styles3.listView}>
        <FlatList data={user} renderItem={listItem} />
      </View>
      <View>
        <Modal isVisible={isModalVisible} backdropOpacity={0.4} animationOutTiming={400}>
          <View style={styles3.modal}>
            <Text style={styles3.modalHeaderText}>{userName}</Text>
            <View style={styles3.modalContent}>
              <Image source={{ uri: "http://10.0.2.2/manthra/resources/images/profile_images/0717414745.png" }}/>
              <Image source={{ uri: userProfileImageStatus == 1 ? "http://10.0.2.2/manthra/resources/images/profile_images/" + userMobile + ".png" : "http://10.0.2.2/manthra/resources/images/user.png" }} style={styles3.modalImg}  />
              <View style={styles3.detailBox}>
                <Icon name="phone-portrait" style={styles3.detailIcon}>{userMobile}</Icon>
                <Icon name="location" style={styles3.detailIcon}>{userLocation}</Icon>
              </View>
              <View style={styles3.btnBox}>
                <TouchableOpacity onPress={closeUserProfile}>
                  <Text style={styles3.closeBtn}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
  
  function loadUserProfile(userProfileObj){
    loadUserLocation();
    setUserName(userProfileObj.name);
    setUserMobile(userProfileObj.mobile);
    setUserProfileImageStatus(userProfileObj.profileImageStatus);
    setModalVisible(true);

    function loadUserLocation(){

      var request = new XMLHttpRequest();

      request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
          var text = request.responseText;
          setUserLocation(text);
        }
      };

      request.open("GET","http://10.0.2.2/manthra/loadCountries.php?id=" + userProfileObj.id, true);
      request.send();
    }
  }

  function closeUserProfile() {
    setModalVisible(false);
  }

  async function goToProfile() {
    const userJSON = await AsyncStorage.getItem("user");
    const userIdObj = JSON.parse(userJSON);
    navigation.navigate("Profile", userIdObj);
  }

  function listItem({ item }) {
    const ui = (
      <Pressable onPress={goToChat}>
        <View style={styles3.list}>
          <Pressable onPress={openUserProfile}>
            <Image source={{ uri: item.profileImageStatus == 1 ? "http://10.0.2.2/manthra/resources/images/profile_images/" + item.mobile + ".png" : "http://10.0.2.2/manthra/resources/images/user.png" }} style={styles3.profileImg} />
          </Pressable>
          <View style={styles3.listContent}>
            <Text style={styles3.userName}>{[item.firstName, " ", item.lastName]}</Text>
            <Text style={styles3.listMsg}>{item.message != "" ? item.message : "Tap to start chat"}</Text>
          </View>
          <View style={parseInt(item.unseenCount) != 0 ? styles3.notifyView : styles3.dNone}>
            <Text style={styles3.timeText}>{item.time}</Text>
            <View style={styles3.notifyIcon}>
              <Text style={styles3.notifyNum}>{item.unseenCount}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );

    function goToChat() {
      const obj = {
        "name": item.firstName + " " + item.lastName,
        "id": item.id,
        "mobile": item.mobile,
        "profileImageStatus": item.profileImageStatus,
      };
      navigation.navigate("Chat", obj);
    }

    function openUserProfile() {
      const userProfileObj = {
        "name": item.firstName + " " + item.lastName,
        "id": item.id,
        "mobile": item.mobile,
        "profileImageStatus": item.profileImageStatus,
      };
      loadUserProfile(userProfileObj);
    }

    return ui;
  }

  return ui;
}

const styles3 = StyleSheet.create(
  {
    main: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "rgb(251, 255, 201)",
    },
    headreView: {
      width: "100%",
      backgroundColor: "yellow",
      flexDirection: "row",
      alignItems: "center",
    },
    headerText: {
      color: "#080808",
      fontSize: 30,
      fontWeight: "bold",
      fontFamily: "Poppins",
      marginVertical: 15,
      paddingLeft: 15,
      flexGrow: 1,
    },
    listView: {
      width: "100%",
      padding: 15,
    },
    list: {
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: 5,
      marginBottom: 20,
    },
    profileImg: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    listContent: {
      flexGrow: 1,
      flexDirection: "column",
      paddingStart: 15,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
    },
    listMsg: {
      fontSize: 17,
      opacity: 0.7,
      color: "black",
    },
    notifyView: {
      width: "16%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    notifyIcon: {
      backgroundColor: "yellow",
      width: 35,
      height: 35,
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    notifyNum: {
      fontWeight: "bold",
      fontSize: 19,
      color: "black",
    },
    textInput: {
      marginTop: 40,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    timeText: {
      fontSize: 14,
      opacity: 0.5,
      color: "black",
      paddingBottom: 5,
    },
    dNone: {
      display: "none",
    },
    userBtn: {
      paddingRight: 15,
    },
    searchView: {
      width: "100%",
      backgroundColor: "yellow",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
      paddingRight: 15,
      paddingLeft: 15,
      gap: 5,
      borderBottomEndRadius: 35,
      borderBottomStartRadius: 35,
    },
    inputText: {
      fontSize: 20,
      color: "#080808",
      marginBottom: 8,
    },
    input: {
      flexGrow: 1,
      backgroundColor: "white",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#5c5c5c8c",
      borderRadius: 20,
      paddingStart: 20,
      paddingEnd: 20,
      fontSize: 18,
      height: 45,
    },
    friendListText: {
      fontSize: 20,
      color: "black",
    },
    friendListBtn: {
      paddingStart: 20,
      paddingEnd: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: "yellow",
      flexDirection: "row",
      alignItems: "center",
    },
    btn: {
      paddingVertical: 10,
      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "#0101003a",
      borderRadius: 25,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
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
    modal: {
      backgroundColor: "yellow",
      borderRadius: 25,
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    modalHeaderText: {
      color: "#080808",
      fontSize: 23,
      fontWeight: "bold",
      fontFamily: "Poppins",
      paddingVertical: 10,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 25,
      width: "100%",
    },
    modalImg: {
      width: "100%",
      height: 250,
    },
    detailBox: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      paddingTop:20,
      paddingBottom:15,
    },
    detailIcon: {
      fontSize: 17,
      color: "#080808",
      opacity:0.8,
    },
    btnBox:{
      flexGrow:1,
      flexDirection:"row",
      justifyContent:"center",
      paddingVertical:15,
    },
    closeBtn:{
      fontSize:18,
      color:"#080808",
    }
  },
);