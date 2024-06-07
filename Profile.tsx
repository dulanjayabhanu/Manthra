import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Profile({ route, navigation }) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("Select Location"); // For upload selected country name
    const [locations, setLocations] = useState(["Select Location"]); // For load all countries
    const [selectLocation, setSelectLocation] = useState("Select Location"); // For load default country
    const [profileImage, setProfileImage] = useState(null);
    const [imgUri, setImgUri] = useState(route.params.profile_image_status == 1 ? "http://10.0.2.2/manthra/resources/images/profile_images/" + route.params.mobile + ".png" : "http://10.0.2.2/manthra/resources/images/user.png");

    const ui = (
        <SafeAreaView style={styles2.main}>
            <View style={styles2.headerView}>
                <TouchableOpacity style={styles2.backBtn} onPress={goToHome}>
                    <Icon name="chevron-back-outline" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles2.headerText}>Edit Profile</Text>
            </View>
            <Image source={{ uri: imgUri }} style={styles2.mianLogo} />
            <TouchableOpacity onPress={selectProfilePicture} style={styles2.cameraBtn}>
                <Icon name="camera-outline" size={38} color="black" />
            </TouchableOpacity>
            <Text style={styles2.mainLogoText}>{[route.params.first_name, " ", route.params.last_name]}</Text>
            <View style={styles2.view1}>
                <View style={styles2.view2}>
                    <TextInput autoCorrect={false} style={styles2.input2} maxLength={20} placeholder={route.params.first_name} onChangeText={setFirstName} />
                    <TextInput autoCorrect={false} style={styles2.input2} maxLength={20} placeholder={route.params.last_name} onChangeText={setLastName} />
                </View>
                <TextInput keyboardType="numeric" style={styles2.input} maxLength={10} placeholder={route.params.mobile} editable={false} />
                <SelectDropdown
                    data={locations}
                    search={true}
                    searchInputTxtColor="black"
                    searchPlaceHolder="Search location"
                    defaultValue={selectLocation}
                    searchPlaceHolderColor="black"
                    renderSearchInputLeftIcon={searchIcon}
                    buttonStyle={styles2.input}
                    dropdownStyle={styles2.dropdown}
                    onSelect={assignLocation}
                />
                <TouchableOpacity style={[styles2.btn, styles2.btnDark]} onPress={updateUser}>
                    <Text style={[styles2.btnText, styles2.btnTextWhite]}>Update Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles2.btn, styles2.btnDanger]} onPress={logOut}>
                    <Text style={[styles2.btnText, styles2.btnTextWhite]}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    async function selectProfilePicture() {
        const options = {
            "mediaType": "photo",
        };
        const result = await launchImageLibrary(options);

        if (result.didCancel) {
        } else {
            const imageObject = {
                uri: result.assets[0].uri,
                name: "profile.png",
                type: "image/png",
            }

            setProfileImage(imageObject);
            setImgUri(result.assets[0].uri);
        }
    }

    function goToHome() {
        navigation.navigate("Home");
    }

    function searchIcon() {
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

    function loadSelectedCountry() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var text = request.responseText;
                setSelectLocation(text);
            }
        };
        request.open("GET", "http://10.0.2.2/manthra/loadCountries.php?id=" + route.params.id, true);
        request.send();
    }

    useEffect(loadCountries, []);
    useEffect(loadSelectedCountry, []);

    function updateUser() {
        var form = new FormData();
        form.append("firstName", firstName);
        form.append("lastName", lastName);
        form.append("mobile", route.params.mobile);
        form.append("location", location);
        form.append("profileImage", profileImage);

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var userUpdateRespons = request.responseText;

                if (userUpdateRespons != "success") {
                    Alert.alert("Message", userUpdateRespons);
                } else {
                    Alert.alert("Message", "Profile update successful");
                }
            }
        };
        request.open("POST", "http://10.0.2.2/manthra/updateUser.php", true);
        request.send(form);
    }

    async function logOut() {
        // await AsyncStorage.removeItem("user");
        Alert.alert("Message", "Log out successful");
        goToApp();
    }

    function goToApp() {
        navigation.navigate("Sign In");
    }

    return ui;
}

const styles2 = StyleSheet.create(
    {
        main: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor:"rgb(251, 255, 201)",
        },
        mianLogo: {
            width: 130,
            height: 130,
            borderRadius: 65,
            marginTop: 30,
        },
        mainLogoText: {
            color: "#080808",
            fontSize: 25,
            fontWeight: "bold",
            fontFamily: "Poppins",
            marginTop: 10,
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
            paddingHorizontal: 30,
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
            borderWidth: 2,
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
        }, btnDanger: {
            backgroundColor: "#ff1306",
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
        },
        headerView: {
            width: "100%",
            backgroundColor: "yellow",
            flexDirection: "row",
            alignItems: "center",
            borderBottomEndRadius: 35,
            borderBottomStartRadius: 35,
        },
        headerText: {
            color: "#080808",
            fontSize: 25,
            fontWeight: "bold",
            fontFamily: "Poppins",
            marginVertical: 15,
            paddingLeft: 15,
        },
        cameraBtn: {
            backgroundColor: "rgba(255, 255, 0, 0.603)",
            borderRadius: 50,
            top: 170,
            padding: 5,
            position: "absolute",
        },
        backBtn: {
            paddingLeft: 5,
        }
    }
);