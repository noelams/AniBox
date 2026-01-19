import {  NativeStackScreenProps } from "@react-navigation/native-stack";
import {  CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import {  BottomTabScreenProps } from "@react-navigation/bottom-tabs";


export interface RootStackParamList {
    [key: string]: object | undefined;
    MAIN_TABS: NavigatorScreenParams<BottomTabsParamList>  
    "Sign In": undefined;
    "Sign Up": undefined;
}

export type BottomTabsParamList ={
    Home: NavigatorScreenParams<HomeStackParamList>;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
    Search: undefined;
}

export type HomeStackParamList ={
  HomeScreen: undefined;
  AniDetails: { id: number };
}

export type ProfileStackParamList ={
  Settings:undefined
  ProfileScreen:undefined
}

export type AniDetailsScreenProps = CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList,"AniDetails">,
    BottomTabScreenProps<BottomTabsParamList,"Home">
>

export type HomeScreen = CompositeScreenProps<
BottomTabScreenProps<BottomTabsParamList,"Home">,
    NativeStackScreenProps<RootStackParamList,"MAIN_TABS">
>

export type SignInScreenProps = NativeStackScreenProps<RootStackParamList,"Sign In">;

export type SignUpScreenProps = NativeStackScreenProps<RootStackParamList,"Sign Up">;

export type ProfileScreenProps = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList,"Profile">,
    NativeStackScreenProps<RootStackParamList,"MAIN_TABS">
>
