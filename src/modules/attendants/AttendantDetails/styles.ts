import styled, {css} from 'styled-components/native';
import {Platform} from 'react-native';

import {MotiImage as Image} from 'moti';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {RectButton} from 'react-native-gesture-handler';

interface TypeProps {
  type: string;
}

export const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
`;

export const PhotoWrapper = styled.View``;

export const Photo = styled(Image)`
  width: ${Platform.OS === 'ios' ? RFValue(45) : RFValue(55)}px;
  height: ${Platform.OS === 'ios' ? RFValue(45) : RFValue(55)}px;

  margin: 0px 6px 6px;
  border-radius: 25px;
`;

export const AttendantWrapper = styled.View`
  padding: 10px;
`;

export const Attendant = styled.View`
  padding-left: ${RFValue(10)}px;
`;

export const AttendantName = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
`;

export const BackButton = styled(RectButton)``;

export const StatusWrapper = styled.View``;

export const Availability = styled.Text<TypeProps>`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(12)}px;
  padding: 5px;
  margin-left: 4px;
  margin-right: 4px;
  ${({type}) =>
    type === 'DISPONIVEL' &&
    css`
      color: ${({theme}) => theme.colors.success};
    `};

  ${({type}) =>
    type === 'OCUPADO' &&
    css`
      color: ${({theme}) => theme.colors.attention};
    `};

  text-transform: capitalize;
`;

export const AttendantDescription = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  height: ${RFValue(120)}px;
`;

export const ProfileDetailsText = styled.Text`
  width: ${RFPercentage(52)}px;
  font-size: ${RFValue(12)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text};
`;

export const ButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;

  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 28px;
`;

export const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.title};
  padding-left: 10px;
  font-size: 10px;
`;

export const Icon = styled(Ionicons)`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(34)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const ChatIconService = styled(Entypo)`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(34)}px;
`;

export const Separator = styled.View`
  margin: 10px 0 10px;
  justify-content: center;
  align-items: center;
  height: ${RFValue(28)}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const SeparatorText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  font-size: 14px;
  font-weight: bold;
`;

export const TimeTableText = styled.Text`
  text-align: center;
  text-transform: none;
  color: ${({theme}) => theme.colors.text};
  font-size: 12px;
`;

export const CommentsWrapper = styled.View`
  background-color: ${({theme}) => theme.colors.shape};
  margin: 2px;
  padding: 8px;
  border: solid 5px;
  border-color: ${({theme}) => theme.colors.primary};
  border-radius: 8px;
`;

export const CommentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const CommentNameView = styled.View`
  height: 18px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.attention};
`;

export const CommentedBy = styled.Text`
  color: ${({theme}) => theme.colors.shape};
  text-transform: lowercase;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.shape};
  font-size: 10px;
`;

export const CommentDate = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text};
  font-size: 10px;
`;

export const Comments = styled.Text`
  padding-left: 10px;
  padding-top: 4px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text};
  font-size: 12px;
`;
