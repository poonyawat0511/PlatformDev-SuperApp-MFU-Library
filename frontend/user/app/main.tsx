import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import BookPage from "./Book";
import RoomReservation from "./RoomReservation";
import Profile from "./profile";
const Tab = createMaterialTopTabNavigator();

export default function Main() {
  return (
    <Tab.Navigator
      initialRouteName="Book"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
        },
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: "#BD1616",
          height: "90%",
          width: "32%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginLeft: 1,
          marginRight: 1,
        },
      }}
    >
      <Tab.Screen
        name="Book"
        component={BookPage}
        options={{
          tabBarLabel: "Book",
          tabBarIcon: ({ color }) => (
            <Entypo name="book" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RoomReservation"
        component={RoomReservation}
        options={{
          tabBarLabel: "Room",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="table" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-graduate" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
