import styled, {css} from 'styled-components/native';
import {TextInput} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  isFocused: boolean;
}

export const Container = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

export const IconContainer = styled.View<Props>`
  height: 56px;
  width: 55px;
  justify-content: center;
  align-items: center;

  margin-right: 2px;
  background-color: ${({theme}) => theme.colors.shape};
  border-bottom-width: 2px;
  border-bottom-color: ${({theme}) => theme.colors.background};

  ${({isFocused, theme}) =>
    isFocused &&
    css`
      border-bottom-width: 2px;
      border-bottom-color: ${theme.colors.attention};
    `}
`;

export const InputText = styled(TextInput)<Props>`
  flex: 1;

  background-color: ${({theme}) => theme.colors.shape};
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;

  padding: 0 23px;

  border-bottom-width: 2px;
  border-bottom-color: ${({theme}) => theme.colors.background};
  ${({isFocused, theme}) =>
    isFocused &&
    css`
      border-bottom-width: 2px;
      border-bottom-color: ${theme.colors.attention};
    `}
`;
