import styled from 'styled-components/native';
import {Dimensions, Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RFValue} from 'react-native-responsive-fontsize';

const {width} = Dimensions.get('window');
const os = Platform.OS;

export const Container = styled.View`
  flex: 1;
  margin-top: 50px;
`;

export const Content = styled.ScrollView`
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 14px;
  background-color: ${({theme}) => theme.colors.background};
`;

export const ConfirmationButton = styled.View`
  flex-direction: row;
  width: 50%;
  margin: 10px;
  padding: 4px 24px 24px;
`;

export const Icon = styled(Ionicons)`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(22)}px;
`;

export const Separator = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: ${RFValue(38)}px;
`;

export const SeparatorText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  font-size: 18px;
  font-weight: bold;
  margin-left: ${width / 8}px;
`;

export const BackButton = styled(RectButton)`
  margin-top: 24px;
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Form = styled.View`
  align-items: center;
  padding: 6px 6px;
`;

export const PriceLabel = styled.Text`
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
  color: ${({theme}) => theme.colors.title};
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(22)}px;
  background-color: ${({theme}) => theme.colors.success_light};
`;

export const MessageText = styled.TextInput`
  flex: 1;
  width: ${os === 'ios' ? RFValue(278) : RFValue(310)}px;
  height: ${os === 'ios' ? RFValue(160) : RFValue(140)}px;
  padding: 14px;
  margin-bottom: 6px;
  background-color: ${({theme}) => theme.colors.shape};
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
  border-bottom-width: 2px;
  border-bottom-color: ${({theme}) => theme.colors.background};
`;

export const OpenButton = styled.Button`
  margin-left: 8px;
  margin-top: 5px;
  margin-bottom: 8px;
  background-color: #fd9e63;
  border-radius: 20px;
  padding: 5px;
  elevation: 2px;
`;

export const ButtonModalText = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
`;

export const MsgModalText = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.regular};
`;
