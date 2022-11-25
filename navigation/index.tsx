/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Entypo, FontAwesome, Foundation } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { type ColorSchemeName, Pressable } from 'react-native'
import React, { useContext } from 'react'

import type { RootStackParamList, RootTabParamList, RootTabScreenProps, RootStackScreenProps } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import NewsContentModalScreen from '../screens/NewsContentModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import NewsScreen from '../screens/NewsScreen'
import UserScreen from '../screens/UserScreen'
import { NewsContext } from '../stores/NewsStore'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="NewsContentModal"
          component={NewsContentModalScreen}
          options={({ route }: RootStackScreenProps<'NewsContentModal'>) => {
            const title = route.params.title
            return { title }
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()
  const { handleNewsRefresh } = useContext(NewsContext)

  return (
    <BottomTab.Navigator
      initialRouteName="News"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="News"
        component={NewsScreen}
        options={({ navigation }: RootTabScreenProps<'News'>) => ({
          title: 'IT News',
          tabBarIcon: ({ color }) => <Entypo name="news" color={color} size={22} style={{ marginBottom: -3 }} />,
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => handleNewsRefresh({ force: true })}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Foundation name="refresh" size={25} color={Colors[colorScheme].text} style={{ marginLeft: 15 }} />
              </Pressable>
            )
          },
        })}
      />
      <BottomTab.Screen
        name="User"
        component={UserScreen}
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={22} style={{ marginBottom: -3 }} />,
        }}
      />
    </BottomTab.Navigator>
  )
}
