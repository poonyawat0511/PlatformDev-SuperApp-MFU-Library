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
        tabBarActiveTintColor: "#FBFBFB",
        tabBarInactiveTintColor: "#FBFBFB",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#BD1616",
        },
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: "#FFFFFF",
          height: 3,
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
