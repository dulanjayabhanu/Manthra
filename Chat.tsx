import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, Pressable, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/dist/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";

export function Chat({ route, navigation }) {

  const [message, setMessage] = useState([]);
  const [reply, setReply] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const [userLocation, setUserLocation] = useState("");

  async function loadChat() {

    var userJson = await AsyncStorage.getItem("user");
    var userId = JSON.parse(userJson).id;

    var form = new FormData();
    form.append("from", userId);
    form.append("to", route.params.id);

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        const chatResponseJSONText = request.responseText;
        if (chatResponseJSONText != "") {
          const chatResponseArray = JSON.parse(chatResponseJSONText);
          setMessage(chatResponseArray);
        }
      }
    };

    request.open("POST", "http://10.0.2.2/manthra/loadChat.php", true);
    request.send(form);
  }

  function chatRequestSender() {
    setInterval(loadChat, 5000);
  }

  useEffect(chatRequestSender, []);

  async function sendReply() {

    var userJson = await AsyncStorage.getItem("user");
    var userId = JSON.parse(userJson).id;

    var form = new FormData();
    form.append("message", reply);
    form.append("from", userId);
    form.append("to", route.params.id);

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        setReply("");
      }
    };

    request.open("POST", "http://10.0.2.2/manthra/saveChat.php", true);
    request.send(form);
  }

  function goToHome() {
    navigation.navigate("Home");
  }

  function loadUserProfile() {
    loadUserLocation();
    setModalVisible(true);
  }

  function loadUserLocation() {

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        var text = request.responseText;
        setUserLocation(text);
      }
    };

    request.open("GET", "http://10.0.2.2/manthra/loadCountries.php?id=" + route.params.id, true);
    request.send();
  }

  function closeUserProfile() {
    setModalVisible(false);
  }

  const ui = (
    <SafeAreaView style={styles4.main}>
      <View style={styles4.headreView}>
        <TouchableOpacity style={styles4.backBtn} onPress={goToHome}>
          <Icon name="chevron-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles4.profileView}>
          <Pressable onPress={loadUserProfile}>
            <Image source={{ uri: route.params.profileImageStatus == 1 ? "http://10.0.2.2/manthra/resources/images/profile_images/" + route.params.mobile + ".png" : "http://10.0.2.2/manthra/resources/images/user.png" }} style={styles4.profileImg} />
          </Pressable>
        </View>
        <View style={styles4.profileName}>
          <Text style={styles4.headerText}>{route.params.name}</Text>
        </View>
      </View>
      <FlatList data={message} renderItem={chatItem} />
      <View style={styles4.messageSendArea}>
        <TextInput style={styles4.messageSendInput} placeholder="Type message..." autoCorrect={false} maxLength={500} onChangeText={setReply} value={reply} />
        <Pressable onPress={sendReply}>
          <Icon name="send" style={styles4.sendIcon} size={35} color="black" />
        </Pressable>
      </View>
      <View>
        <Modal isVisible={isModalVisible} backdropOpacity={0.4} animationOutTiming={400}>
          <View style={styles4.modal}>
            <Text style={styles4.modalHeaderText}>{route.params.name}</Text>
            <View style={styles4.modalContent}>
              <Image source={{ uri: "http://10.0.2.2/manthra/resources/images/profile_images/0717414745.png" }} />
              <Image source={{ uri: route.params.profileImageStatus == 1 ? "http://10.0.2.2/manthra/resources/images/profile_images/" + route.params.mobile + ".png" : "http://10.0.2.2/manthra/resources/images/user.png" }} style={styles4.modalImg} />
              <View style={styles4.detailBox}>
                <Icon name="phone-portrait" style={styles4.detailIcon}>{route.params.mobile}</Icon>
                <Icon name="location" style={styles4.detailIcon}>{userLocation}</Icon>
              </View>
              <View style={styles4.btnBox}>
                <TouchableOpacity onPress={closeUserProfile}>
                  <Text style={styles4.closeBtn}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );

  function chatItem({ item }) {
    const ui = (
      <View style={item.side == "right" ? styles4.chatViewRight : styles4.chatView}>
        <View style={item.side == "right" ? styles4.chatBoxRight : styles4.chatBox}>
          <View style={styles4.msgTextArea}>
            <Text style={item.side == "right" ? styles4.msgTextRight : styles4.msgText}>{item.content}</Text>
          </View>
          <View style={styles4.timeArea}>
            <Icon name="checkmark-outline" size={18} color="yellow" style={item.side == "left" || item.deliverStatus == "seen" ? styles4.dNone : styles4.chatIcon} />
            <Icon name="checkmark-done-outline" size={18} color="yellow" style={item.side == "left" || item.deliverStatus == "unseen" ? styles4.dNone : styles4.chatIcon} />
            <Text style={item.side == "right" ? styles4.timeRight : styles4.time}>{item.time}</Text>
          </View>
        </View>
      </View>
    );

    return ui;
  }

  return ui;
}

const styles4 = StyleSheet.create(
  {
    main: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      width: "100%",
      flexGrow: 1,
      backgroundColor: "rgb(251, 255, 201)",
    },
    headreView: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      backgroundColor: "yellow",
      borderBottomEndRadius: 35,
      borderBottomStartRadius: 35,
    },
    headerText: {
      color: "#080808",
      fontSize: 23,
      fontWeight: "bold",
      fontFamily: "Poppins",
      marginVertical: 15,
    },
    profileView: {
      width: 90,
      padding: 15,
    },
    profileImg: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    profileName: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    chatView: {
      paddingStart: 15,
      paddingEnd: 15,
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    chatViewRight: {
      paddingStart: 15,
      paddingEnd: 15,
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    chatBox: {
      flexDirection: "column",
      backgroundColor: "yellow",
      paddingVertical: 6,
      paddingHorizontal: 6,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#0101003a",
      borderRadius: 15,
      marginBottom: 12,
      maxWidth: "50%",
    },
    chatBoxRight: {
      flexDirection: "column",
      backgroundColor: "black",
      paddingVertical: 6,
      paddingHorizontal: 6,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#0101003a",
      borderRadius: 15,
      marginBottom: 12,
      maxWidth: "50%",
    },
    msgTextArea: {
      flexDirection: "column",
      paddingStart: 10,
      paddingTop: 10,
      paddingEnd: 10,
      paddingBottom: 6,
    },
    timeArea: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    msgText: {
      fontSize: 17,
      color: "black",
    },
    msgTextRight: {
      fontSize: 17,
      color: "white",
    },
    time: {
      top: 2,
      end: 1,
      color: "black",
      opacity: 0.5,
    },
    timeRight: {
      top: 2,
      end: 5,
      color: "white",
      opacity: 0.6,
    },
    chatIcon: {
      marginLeft: 8,
      paddingRight: 10,
    },
    dNone: {
      display: "none",
    },
    messageSendArea: {
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: 15,
      paddingBottom: 15,
    },
    messageSendInput: {
      width: "100%",
      borderStyle: "solid",
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "#0101003a",
      borderRadius: 25,
      paddingStart: 20,
      paddingEnd: 55,
      fontSize: 22,
    },
    sendIcon: {
      top: 8,
      end: 45,
    },
    backBtn: {
      paddingLeft: 5,
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
      paddingTop: 20,
      paddingBottom: 15,
    },
    detailIcon: {
      fontSize: 17,
      color: "#080808",
      opacity: 0.8,
    },
    btnBox: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: 15,
    },
    closeBtn: {
      fontSize: 18,
      color: "#080808",
    }
  }
);