import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Dimensions, Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const os = Platform.OS;

export const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colors.shape};
  height: 100%;
  /* margin-top: ${os === 'ios' ? RFValue(56) : RFValue(12)}px; */
`;

export const BoxSelection = styled.View`
  margin-top: 10%;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({theme}) => theme.colors.secondary};
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: solid 2px ${({theme}) => theme.colors.secondary};
`;

export const SelectionWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ModalTextLabel = styled.Text`
  padding-left: 10px;
  font-size: ${RFValue(14)};
  color: ${({theme}) => theme.colors.shape};
  font-family: ${({theme}) => theme.fonts.medium};
`;

export const Title = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: ${Platform.OS === 'ios' ? RFValue(20) : RFValue(24)}px;
`;

export const TitleText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  font-size: 18px;
  font-weight: bold;
  margin-left: ${width / 3.8}px;
`;

export const Separator = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 1px;
  background-color: ${({theme}) => theme.colors.text};
`;

export const BackButton = styled(RectButton)`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Icon = styled(Ionicons)`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(22)}px;
  /* margin-top: ${Platform.OS === 'ios' ? RFValue(-4) : RFValue(3)}px; */
`;

export const SelectButton = styled(RectButton)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: ${RFValue(60)}px;
`;
