import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookPage from './Book';
import RoomReservation from './RoomReservation';
import Profile from './profile';

// Create the Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function Main() {
  return (
    
      <Tab.Navigator
        initialRouteName="Book"
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#303030',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: '#ffdada' },
          swipeEnabled: false,   
        }}
      >
        <Tab.Screen
          name="Book"
          component={BookPage}
          options={{ tabBarLabel: 'Book' }}
        />
        <Tab.Screen
          name="RoomReservation"
          component={RoomReservation}
          options={{ tabBarLabel: 'Room' }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    
  );
}
