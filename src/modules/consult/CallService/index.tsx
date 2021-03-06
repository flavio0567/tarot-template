import React, {useState, useEffect} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import api from '../../../shared/services/api';
import {useAuth} from '../../../shared/hooks/globalContext';
import {Button} from '../../../shared/components/Button';
import {useTheme} from 'styled-components';
import {initializeApp} from 'firebase/app';
import {Input} from '../../../shared/components/Input';

import {getDatabase, ref, onValue} from 'firebase/database';

import {
  Container,
  Icon,
  Separator,
  SeparatorText,
  BackButton,
  TimeInfoWrapper,
  TimeInfoLabel,
  TimeInfo,
  Time,
  Country,
  ModalTextLabel,
  Form,
  ButtonClose,
} from './styles';

interface ConfigProps {
  apiKey: string;
  databaseURL: string;
  hash: string;
}

interface AttDetailProps {
  AttUltimoKey: number;
  AttValorPorMinuto: number;
  ChatUltimoCodigo: number;
  CliCreditos: number;
  CliQtdMinutos: number;
  CliQtdSegundos: number;
  CliUltimoKey: number;
  CodigoStatus: number;
  ComissaoPorc: number;
  InicioCobranca: number;
  IsIniciadoCobranca: string;
  IsTipo: string;
  QtdCreditosGanhos: number;
  QtdSegundosGanhos: number;
  Sta: string;
  Tipo: string;
}

type NavProps = NavigationProp<ParamListBase>;

export function CallService({route}: any) {
  const {attendant} = route.params;
  const {user, callingCode} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const navigation = useNavigation<NavProps>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('55');
  const [items, setItems] = useState([
    {label: '๐ง๐ท Brazil', value: '55'},
    {label: '๐ต๐น Portugal', value: '351'},
    {label: '๐บ๐ธ Estados Unidos', value: '1'},
    {label: '๐จ๐ฆ Canadรก', value: '01'},
    {label: '๐ฏ๐ต Japรฃo', value: '81'},
    {label: '๐ซ๐ท Franรงa', value: '33'},
    {label: '๐ฎ๐น Itรกlia', value: '39'},
    {label: '๐ช๐ธ Espanha', value: '34'},
    {label: '๐ฌ๐ง Reino Unido', value: '44'},
    {label: '๐ฎ๐ช Irlanda', value: '353'},
    {label: '๐ฉ๐ช Alemanha', value: '49'},
  ]);

  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [serviceCode, setServiceCode] = useState(0);
  const [attDetail, setAttDetail] = useState<AttDetailProps>();
  const [time, setTime] = useState(0);
  const [amountSeconds, setAmountSeconds] = useState(0);
  const [amountMinutes, setAmountMinutes] = useState(0);
  const [timeFormatted, setTimeFormatted] = useState('');
  const [spendingTime, setSpendingTime] = useState('');

  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [diffTime, setDiffTime] = useState(0);

  const [serverTime, setServerTime] = useState(0);

  const startNewService = async () => {
    await api.get('outros/hora-servidor/').then(res => {
      const {Mktime} = res.data;
      console.log('serverTime:', Mktime);
      setServerTime(Mktime);
    });

    setIsLoading(true);
    console.log('value:', value, 'phonenumber:', phoneNumber);
    await api
      .post('atendimentos/telefone/219/', {
        TelefoneDDI: value,
        Telefone: phoneNumber,
      })
      .then(responseCall => {
        setIsLoading(false);
        const {Atendimento} = responseCall.data;
        setServiceCode(Atendimento.Codigo);
        const {ApiKey, DatabaseURL, Hash} = responseCall.data.Firebase;
        const config = {
          apiKey: ApiKey,
          databaseURL: DatabaseURL,
          hash: Hash,
        };
        init(config);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error no call atendimentos/telefone/att', error);
        handleHangUp();
      });
  };

  const handleRemainingMinutes = () => {
    if (attDetail?.IsIniciadoCobranca === 'S') {
      setTime(serverTime - attDetail.InicioCobranca);
      setAmountSeconds(attDetail.CliQtdSegundos);
      setDiffTime(amountSeconds - time);
      setAmountMinutes(Math.round(diffTime / 60));

      setRemainingMinutes(amountMinutes);
      setRemainingTime(diffTime);
    } else {
      setRemainingMinutes(-1);
      setRemainingTime(-1);
    }
  };

  const handleRemainingTime = () => {
    const diff: number = Math.ceil(parseFloat(String(remainingTime)));
    // eslint-disable-next-line no-shadow
    let timeFormatted: string = '';

    if (diff > 0) {
      if (diff < 60) {
        console.log('Alerta de crรฉdito:', 'Menos de 1 minuto');
      } else {
        const day = Math.floor(diff / 86400);
        const hours: number = Math.floor((diff - day * 86400) / 3600);
        const minutes = Math.floor((diff - day * 86400 - hours * 3600) / 60);
        const seconds = Math.round(
          diff - day * 86400 - hours * 3600 - minutes * 60,
        );

        const xhours = ('00' + hours).substring(('00' + hours).length - 2);
        const xminutes = ('00' + minutes).substring(
          ('00' + minutes).length - 2,
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const xseconds = ('00' + seconds).substring(
          ('00' + seconds).length - 2,
        );

        if (hours > 0) {
          timeFormatted = timeFormatted + '' + xhours + 'h';
        }

        if (minutes > 0 || hours > 0) {
          timeFormatted = timeFormatted + ' ' + xminutes + 'm';
        }

        setTimeFormatted(timeFormatted);
      }
    }
  };

  const handleSpendingTime = () => {
    console.log('inicio cobranca:', attDetail?.InicioCobranca);

    if (serverTime && attDetail?.InicioCobranca! > 0) {
      const diff = serverTime - attDetail?.InicioCobranca!;

      const day = Math.floor(diff / 86400);
      const hours = Math.floor((diff - day * 86400) / 3600);
      const minutes = Math.floor((diff - day * 86400 - hours * 3600) / 60);
      const seconds = Math.round(
        diff - day * 86400 - hours * 3600 - minutes * 60,
      );

      const xhours = ('00' + hours).substring(('00' + hours).length - 2);
      const xminutes = ('00' + minutes).substring(('00' + minutes).length - 2);
      const xseconds = ('00' + seconds).substring(('00' + seconds).length - 2);

      // eslint-disable-next-line @typescript-eslint/no-shadow
      let timeFormatted = '';

      if (hours > 0) {
        timeFormatted = timeFormatted + '' + xhours + 'h';
      }

      if (minutes > 0 || hours > 0) {
        timeFormatted = timeFormatted + ' ' + xminutes + 'm';
      }

      if (seconds > 0 || minutes > 0 || hours > 0) {
        timeFormatted = timeFormatted + ' ' + xseconds + 's';
      }

      setSpendingTime(timeFormatted);
    } else {
      setSpendingTime('--');
    }
  };

  useEffect(() => {
    const timer = setTimeout(function () {
      setServerTime(serverTime + 1);
      handleRemainingMinutes();
      handleRemainingTime();
      handleSpendingTime();
    }, 1000);
    return () => clearTimeout(timer);
  }, [serverTime]);

  function init(config: ConfigProps) {
    let isMounted = true;
    const {apiKey, databaseURL, hash} = config;

    const app = initializeApp({apiKey, databaseURL});
    const database = getDatabase(app);

    try {
      const databaseDataRef = ref(database, `/atendimentos/${hash}/dados/`);

      if (isMounted) {
        onValue(
          databaseDataRef,
          (snapshot: {exists: () => any; val: () => any}) => {
            if (snapshot.exists()) {
              setAttDetail(snapshot.val());

              if (snapshot.val().CodigoStatus === '4') {
                Alert.alert('Atendimento encerrado pelo Atendente!');
                api.post(`atendimentos/finalizar/${serviceCode}/`);
                setAttDetail({} as AttDetailProps);
                navigation.navigate('Main');
              }
            }
          },
        );
      }
    } catch (error) {
      console.log('Finishing init():', error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }

  function handleHangUp() {
    const IsIniciadoCobranca = attDetail?.IsIniciadoCobranca;

    if (serviceCode && IsIniciadoCobranca === 'S') {
      api
        .post(`atendimentos/finalizar/${serviceCode}/`)
        .then(res => console.log('retorno no final:', res.data));
    }
    navigation.navigate('Main');
  }

  return (
    <Container>
      <Separator>
        <BackButton onPress={handleHangUp}>
          <Icon name="chevron-back" />
        </BackButton>
        <SeparatorText maxFontSizeMultiplier={1.4}>
          Consulta por Telefone
        </SeparatorText>
      </Separator>

      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={-500}>
          <Country>
            <ModalTextLabel maxFontSizeMultiplier={1.4}>
              Informe o nรบmero do seu celular
            </ModalTextLabel>
            <DropDownPicker
              containerStyle={{
                backgroundColor: theme.colors.success,
              }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
            <ModalTextLabel maxFontSizeMultiplier={1.4}>
              Preencha o seu Telefone com DDD
            </ModalTextLabel>
            <Form>
              <Input
                onChangeText={onChangePhoneNumber}
                value={phoneNumber}
                placeholder="nรบmero do seu celular"
                keyboardType="numeric"
                iconName={'smartphone'}
                maxFontSizeMultiplier={1.2}
              />
            </Form>
            <Button
              title="Iniciar a Consulta"
              onPress={() => startNewService()}
              enabled={phoneNumber ? true : false}
              color={theme.colors.success}
            />
          </Country>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView behavior="padding" enabled>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Country>
              <ModalTextLabel maxFontSizeMultiplier={1.4}>
                Selecione o Paรญs
              </ModalTextLabel>
              <DropDownPicker
                containerStyle={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                }}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
              <ModalTextLabel maxFontSizeMultiplier={1.4}>
                Preencha o seu Telefone com DDD
              </ModalTextLabel>
              <Form>
                <Input
                  onChangeText={onChangePhoneNumber}
                  value={phoneNumber}
                  placeholder="nรบmero do seu celular"
                  keyboardType="numeric"
                  iconName={'smartphone'}
                  maxFontSizeMultiplier={1.4}
                />
              </Form>
              <Button
                title="Iniciar a Consulta"
                onPress={() => startNewService()}
                enabled={phoneNumber ? true : false}
                color={theme.colors.success}
                loading={isLoading}
              />
            </Country>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      <TimeInfoWrapper>
        <TimeInfo>
          <TimeInfoLabel>
            <Time maxFontSizeMultiplier={1.4}>Tempo Restante</Time>
          </TimeInfoLabel>
          <Time maxFontSizeMultiplier={1.4}>{timeFormatted}</Time>
        </TimeInfo>
        <TimeInfo>
          <TimeInfoLabel>
            <Time maxFontSizeMultiplier={1.4}>Tempo Gasto</Time>
          </TimeInfoLabel>
          <Time maxFontSizeMultiplier={1.4}>{spendingTime}</Time>
        </TimeInfo>
      </TimeInfoWrapper>
      <ButtonClose onPress={handleHangUp}>
        <Time maxFontSizeMultiplier={1.4}>Finalizar Atendimento</Time>
      </ButtonClose>
    </Container>
  );
}
