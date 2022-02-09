/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

import {useTheme} from 'styled-components';
import {Button} from '../../../shared/components/Button';
import {Alert} from 'react-native';
import api from '../../../shared/services/api';
import {useAuth} from '../../../shared/hooks/globalContext';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  UserName,
  SideWrapper,
  BalanceView,
  BalanceText,
  PhotoWrapper,
  Photo,
  Title,
  Icon,
  IconBack,
  ChatIconService,
  BackButton,
  Availability,
  AttendantWrapper,
  Attendant,
  ButtonWrapper,
  ButtonServiceChannel,
  NavBack,
  Separator,
  SeparatorText,
  ConfirmationButton,
  PickerView,
  PickerButton,
} from './styles';

interface PriceProps {
  Codigo: number;
  Titulo: string;
  Valor: number;
}

type ItemProps = {
  Valor: string;
  Titulo: string;
};

type NavProps = NavigationProp<ParamListBase>;

export function SelectedAttendant({route}: any) {
  const {mode} = route.params;
  const attendant: any = route.params.attendant.item;
  const {selectedMode, user} = useAuth();
  const [serviceChannel, setServiceChannel] = useState(mode);
  const [selectedSalesPrice, setSelectedSalesPrice] = useState<any>();

  const [showSalesPrice, setshowSalesPrice] = useState(true);
  const [salesPrice, setSalesPrice] = useState([]);
  const navigation = useNavigation<NavProps>();
  const theme = useTheme();

  useEffect(() => {
    api.get('comprar-pacotes-creditos/listagem/').then(res => {
      const price = res.data;
      setSelectedSalesPrice(price[0]);
      setSalesPrice(res.data);
    });
  }, []);

  async function handlePaymentOptions() {
    const price = salesPrice?.filter((value: PriceProps) => {
      let val;
      if (selectedSalesPrice.Valor) {
        val = selectedSalesPrice.Valor;
      } else {
        val = selectedSalesPrice;
      }
      return value.Valor === val;
    });
    await api.get('outros/formas-pagamento/').then(res => {
      const paymentMethods = res.data;
      navigation.navigate('PaymentOptions', {attendant, price, paymentMethods});
    });
  }

  async function handleChatService() {
    setServiceChannel('chat');
    selectedMode('chat');

    const pricePerMinute = attendant.ValorPorMinuto;

    if (pricePerMinute) {
      if (user.qtdcreditos > pricePerMinute * 3) {
        Alert.alert(
          'Saldo atual insuficiente.',
          'Para realizar uma nova consulta com tempo hábil para perguntas e respostas, favor adquirir mais créditos!',
        );
        return;
      }
    } else {
      Alert.alert(
        'Problemas ao obter saldo.',
        'Não foi possível obter seu saldo atualizado para efetivar a consulta, favor entrar com contato!',
      );
    }

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigation.navigate('ChatService', {attendant});
          } else {
            Alert.alert(
              'Consulta não disponível:',
              'Token do Cliente não encontrado, favor tentar novamente!',
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
        'Consulta não disponível:',
        'O consultor não está disponível, tente novamente mais tarde!',
      );
    }
  }

  async function handleCallService() {
    setServiceChannel('call');
    selectedMode('call');

    const pricePerMinute = attendant.ValorPorMinuto;

    if (pricePerMinute) {
      if (user.qtdcreditos > pricePerMinute * 3) {
        Alert.alert(
          'Saldo atual insuficiente.',
          'Para realizar uma nova consulta com tempo hábil para perguntas e respostas, favor adquirir mais créditos!',
        );
        return;
      }
    } else {
      Alert.alert(
        'Problemas ao obter saldo.',
        'Não foi possível obter seu saldo atualizado para efetivar a consulta, favor entrar com contato!',
      );
    }

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigation.navigate('CallService', {attendant});
          } else {
            Alert.alert(
              'Consulta não disponível:',
              'Token do Cliente não encontrado, favor tentar novamente!',
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
        'Consulta não disponível:',
        'O consultor não está disponível, tente novamente mais tarde!',
      );
    }
  }

  async function handleVideocamService() {
    setServiceChannel('videocam');
    selectedMode('videocam');

    const pricePerMinute = attendant.ValorPorMinuto;

    if (pricePerMinute) {
      if (user.qtdcreditos > pricePerMinute * 3) {
        Alert.alert(
          'Saldo atual insuficiente.',
          'Para realizar uma nova consulta com tempo hábil para perguntas e respostas, favor adquirir mais créditos!',
        );
        return;
      }
    } else {
      Alert.alert(
        'Problemas ao obter saldo.',
        'Não foi possível obter seu saldo atualizado para efetivar a consulta, favor entrar com contato!',
      );
    }

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigation.navigate('VideoService', {attendant});
          } else {
            Alert.alert(
              'Consulta não disponível:',
              'Token do Cliente não encontrado, favor tentar novamente!',
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
        'Consulta não disponível:',
        'O consultor não está disponível, tente novamente mais tarde!',
      );
    }
  }

  async function handleEmailService() {
    setServiceChannel('mail');
    selectedMode('mail');

    if (user.qtdcreditos >= 49.9) {
      Alert.alert(
        'Saldo atual insuficiente.',
        'Para realizar uma nova consulta com tempo hábil para perguntas e respostas, favor adquirir mais créditos!',
      );
      return;
    }

    async function callAPI() {
      try {
        if (api.defaults.headers.TOKEN) {
          navigation.navigate('EmailService', {attendant});
        } else {
          Alert.alert(
            'Consulta não disponível:',
            'Token do Cliente não encontrado, favor tentar novamente!',
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    callAPI();
  }

  return (
    <Container>
      <NavBack>
        <BackButton onPress={() => navigation.goBack()}>
          <IconBack name="chevron-back" />
        </BackButton>
        <SeparatorText maxFontSizeMultiplier={1.4} style={{marginLeft: 40}}>
          Consultor Selecionado
        </SeparatorText>
      </NavBack>
      <Header>
        <UserWrapper>
          <UserInfo>
            <UserName maxFontSizeMultiplier={1.4}>{user.name}</UserName>
          </UserInfo>
          <SideWrapper>
            <BalanceView>
              <BalanceText maxFontSizeMultiplier={1.4}>Meu Saldo</BalanceText>
              <BalanceText maxFontSizeMultiplier={1.4}>
                R$ {user.qtdcreditos.toFixed(2)}
              </BalanceText>
            </BalanceView>
          </SideWrapper>
        </UserWrapper>
      </Header>
      <AttendantWrapper>
        <PhotoWrapper>
          <Photo source={{uri: `${attendant.Cadastro.Foto}`}} />
        </PhotoWrapper>
        <Attendant>
          <Title maxFontSizeMultiplier={1.4}>{attendant.Cadastro.Nome}</Title>
          <Availability
            maxFontSizeMultiplier={1.4}
            type={attendant.Cadastro.Status}>
            {attendant.Cadastro.Status}
          </Availability>
        </Attendant>
      </AttendantWrapper>
      <Separator>
        <SeparatorText maxFontSizeMultiplier={1.4}>
          Criar Atendimento
        </SeparatorText>
      </Separator>
      <ButtonWrapper>
        {attendant.FormasAtt.Telefone === 'DISPONIVEL' && (
          <ButtonServiceChannel onPress={handleCallService}>
            <Icon
              name="call"
              style={{
                color:
                  serviceChannel === 'call' ? theme.colors.secondary : '#fff',
                top: 4,
              }}
            />
          </ButtonServiceChannel>
        )}
        {attendant.FormasAtt.Chat !== 'NAOATENDENTE' && (
          <ButtonServiceChannel onPress={handleChatService}>
            <ChatIconService
              name="chat"
              style={{
                color:
                  serviceChannel === 'chat' ? theme.colors.secondary : '#fff',
                top: 3,
              }}
            />
          </ButtonServiceChannel>
        )}
        {attendant.FormasAtt.Video === 'DISPONIVEL' && (
          <ButtonServiceChannel onPress={handleVideocamService}>
            <Icon
              name="videocam"
              style={{
                color:
                  serviceChannel === 'videocam'
                    ? theme.colors.secondary
                    : '#fff',
                top: 3,
              }}
            />
          </ButtonServiceChannel>
        )}
        {attendant.FormasAtt.Email !== 'NAOATENDENTE' && (
          <ButtonServiceChannel onPress={handleEmailService}>
            <Icon
              name="mail"
              style={{
                color:
                  serviceChannel === 'mail' ? theme.colors.secondary : '#fff',
                top: 4,
              }}
            />
          </ButtonServiceChannel>
        )}
      </ButtonWrapper>

      <Separator>
        <SeparatorText maxFontSizeMultiplier={1.4}>
          Comprar Crédito
        </SeparatorText>
      </Separator>

      {showSalesPrice && (
        <PickerView>
          <PickerButton
            selectedValue={selectedSalesPrice}
            onValueChange={item => setSelectedSalesPrice(item)}>
            {salesPrice.map((item: ItemProps, index) => {
              return (
                <PickerButton.Item
                  value={item.Valor}
                  label={item.Titulo}
                  key={index}
                />
              );
            })}
          </PickerButton>
        </PickerView>
      )}

      <ConfirmationButton>
        <Button
          title="Efetuar pagamento"
          onPress={handlePaymentOptions}
          color="secondary"
        />
      </ConfirmationButton>
    </Container>
  );
}
