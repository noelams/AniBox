import { ReactNode } from "react";
import { ColorKey } from "../Constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ImageSourcePropType, KeyboardTypeOptions } from "react-native";

export interface CustomButtonProps {
    onPress: () => void,
    title: string | ReactNode,
    disabled?: boolean,
    customStyles?: object,
    customTextStyles?: object,
}

export interface CustomInputProps {
    placeholder: string,
    onChangeText : (text: string) => void,
    value?: string,
    isPassword?: boolean,
    customInputContainerStyle?: object,
    customInputStyle?: object,
    keyboardType?:KeyboardTypeOptions,
    returnKeyLabel?: string,
    icon?: ReactNode,
}

export interface BackButtonProps {
    color?: ColorKey,
    customContainerStyles?: Object,
    position?: string,
    absolutePositionStyles?: Object,
    iconSize?: number,
    backgroundColor?: string,
}

export interface AppTextProps {
    title: string | ReactNode,
    style?: object,
}

export interface LogButtonProps {
    onPress: () => void,
    backgroundColor?: string,
    icon?: string,
    customStyles?: object,
    iconName?: string,
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

export interface StatusButtonProps{
    iconName: IconName,
    size?: number,
    iconColor?: string,
    customStyles?: Object,
    label: string,
    customLabelStyles?: Object,
    onPress:()=> void,
}

export type AuthField = {
  name: string;
  icon: ReactNode;
  placeholder: string;
  isPassword?: boolean;
}

export interface AuthFormProps{
    title:string,
    subTitle:string,
    fields:AuthField[],
    onSubmit: (formData: Record<string, string>) => void | Promise<void>;
    alternateText:string,
    alternateActionLabel:string,
    alternateActionTarget: "Sign Up"|"Sign In",
    image:ImageSourcePropType,
}

export type CustomTitleProps= {
    title: string,
    subTitle?: string,
}

export interface ConfirmModalProps{
    visible:boolean,
    onClose: ()=> void,
    onConfirm: ()=> void,
    message:string,
    buttonLabel?:string,
}

export interface CoverPhotoProps{
    onChangeCover: ()=> void,
    coverImage: string | null,
    onChangeProfile: ()=> void,
    profileImage: string | null,
    displayName: string,
}

export type HeaderSectionProps = {
    profileImage: string | null,
    profileName?: string,
}

export type ProfilePicProps = {
    image: string | null,
    onEdit: ()=> void,
    displayName: string,
}

export type SummaryBoxProps = {
    title: string,
    value: string | number,
    color?:ColorKey 
}