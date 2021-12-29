import React, {useState, useEffect, useCallback} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';

import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import api from '../../../shared/services/api';
import {useAuth} from '../../../shared/hooks/globalContext';
import uuid from 'react-native-uuid';
import {
  GiftedChat,
  InputToolbar,
  SystemMessage,
} from 'react-native-gifted-chat';

import tarotIcon from '../../../assets/tarot_icon.png';

import {useTheme} from 'styled-components';
import {initializeApp} from 'firebase/app';

import {
  getDatabase,
  ref,
  onValue,
  push,
  DatabaseReference,
} from 'firebase/database';

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
  Button,
} from './styles';

export interface MsgProps {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
}

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

const customtInputToolbar = (props: any) => {
  return (
    <InputToolbar
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      containerStyle={{
        backgroundColor: 'white',
        borderTopColor: '#E8E8E8',
        borderTopWidth: 2,
        maxFontSizeMultiplier: 1,
        fontSize: 10,
      }}
    />
  );
};

const customSystemMessage = props => {
  return (
    <View style={{backgroundColor: '#ff9999'}}>
      <>
        <Icon name="lock" color="#9d9d9d" size={16} />
        <Text style={{color: '#FF9000'}}>
          Your chat is secured. Remember to be cautious about what you share
          with others.
        </Text>
      </>
    </View>
  );
};

export function VideoService({route}: any) {
  const {attendant} = route.params;
  const navigation = useNavigation<NavProps>();

  const [messages, setMessages] = useState<MsgProps[]>([]);
  const {user} = useAuth();
  const theme = useTheme();

  const [serviceCode, setServiceCode] = useState(0);
  const {Cadastro} = attendant;
  const [iFrame, setIframe] = useState('');
  const [attDetail, setAttDetail] = useState<AttDetailProps>();
  const [time, setTime] = useState(0);
  const [amountSeconds, setAmountSeconds] = useState(0);
  const [amountMinutes, setAmountMinutes] = useState(0);
  const [timeFormatted, setTimeFormatted] = useState('');
  const [spendingTime, setSpendingTime] = useState('');

  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [diffTime, setDiffTime] = useState(0);

  const [databaseRef, setDatabaseRef] = useState<DatabaseReference>();

  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    setMessages([
      {
        _id: uuid.v4(),
        text: 'Por favor aguarde, seu atendimento terá início em instantes!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Tarot Online',
          avatar: tarotIcon,
        },
      },
    ]);

    const getServerTime = async () => {
      await api.get('outros/hora-servidor/').then((responseServer: any) => {
        const {Mktime} = responseServer.data;
        setServerTime(Mktime);
      });

      await api.post('atendimentos/video/219/').then((responseVideo: any) => {
        const {Atendimento, Video} = responseVideo.data;
        setIframe(Video.Iframe);
        setServiceCode(Atendimento.Codigo);

        const {ApiKey, DatabaseURL, Hash} = responseVideo.data.Firebase;

        const config = {
          apiKey: ApiKey,
          databaseURL: DatabaseURL,
          hash: Hash,
        };

        init(config);
      });
    };
    getServerTime();
  }, []);

  useEffect(() => {
    const timer = setTimeout(function () {
      setServerTime(serverTime + 1);
      handleRemainingMinutes();
      handleRemainingTime();
      handleSpendingTime();
    }, 1000);
    return () => clearTimeout(timer);
  }, [serverTime]);

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
    let timeFormatted: string = '';

    if (diff > 0) {
      if (diff < 60) {
        console.log('Alerta de crédito:', 'Menos de 1 minuto');
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

  function init(config: ConfigProps) {
    const {apiKey, databaseURL, hash} = config;

    const app = initializeApp({apiKey, databaseURL});
    const database = getDatabase(app);

    const databaseDataRef = ref(database, `/atendimentos/${hash}/dados/`);

    onValue(
      databaseDataRef,
      (snapshot: {exists: () => any; val: () => any}) => {
        if (snapshot.exists()) {
          setAttDetail(snapshot.val());

          if (snapshot.val().CodigoStatus === '4') {
            setMessages([
              {
                _id: uuid.v4(),
                text: 'Seu atendimento foi encerrado pelo Atendente!',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'Tarot Online',
                  avatar: tarotIcon,
                },
              },
            ]);
            api.post(`atendimentos/finalizar/${serviceCode}/`);
            setAttDetail({} as AttDetailProps);
          }
        }
      },
    );

    const databaseMsgRef: DatabaseReference = ref(
      database,
      `/atendimentos/${hash}/mensagens/`,
    );

    setDatabaseRef(databaseMsgRef);

    onValue(databaseMsgRef, snapshot => {
      if (snapshot.exists()) {
        const msg = snapshot.val();
        const key = Object.keys(msg)[Object.keys(msg).length - 1];
        const val = msg[key];
        if (val.OriTipo === 'A') {
          setMessages(previous =>
            GiftedChat.append(previous, {
              _id: uuid.v4(),
              text: val.Mensagem,
              createdAt: new Date(),
              user: {
                // _id: Cadastro.Codigo,
                _id: 219,
                // name: Cadastro.Nome,
                name: 'Atendente Teste',
                avatar: Cadastro.Foto,
              },
            }),
          );
        }
      } else {
        console.log('No data available');
      }
    });
  }

  function send(messages: any[]) {
    messages.map((item: any) => {
      const msg = {
        OriTipo: 'C',
        Mensagem: item.text,
        Mktime: serverTime,
        Mktime2: serverTime,
      };
      push(databaseRef!, msg);
    });
  }

  const onSend = useCallback((message = []) => {
    setMessages(previous => GiftedChat.append(previous, message));
  }, []);

  const chat = (
    <GiftedChat
      messages={messages}
      renderInputToolbar={props => customtInputToolbar(props)}
      renderSystemMessage={props => customSystemMessage(props)}
      onSend={message => {
        onSend(message), send(message);
      }}
      user={{_id: user.id}}
    />
  );

  function handleChatOff() {
    const IsIniciadoCobranca = attDetail?.IsIniciadoCobranca;
    console.log('IsIniciadoCobranca:', IsIniciadoCobranca);
    if (IsIniciadoCobranca === 'S') {
      api.post(`atendimentos/finalizar/${serviceCode}/`);
    }
    navigation.navigate('Main');
  }

  return (
    <Container>
      <Separator>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" />
        </BackButton>
        <SeparatorText maxFontSizeMultiplier={1.4}>
          Consulta por Vídeo
        </SeparatorText>
      </Separator>

      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset={30}
          enabled>
          {attDetail?.IsIniciadoCobranca === 'S' && (
            <WebView
              originWhitelist={['*']}
              bounces={true}
              automaticallyAdjustContentInsets={false}
              allowInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              androidHardwareAccelerationDisabled={true}
              source={{uri: `${iFrame}`}}
              useWebkit
            />
          )}
          {chat}
        </KeyboardAvoidingView>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          {attDetail?.IsIniciadoCobranca === 'S' && (
            <WebView
              style={{opacity: 0.99, overflow: 'hidden'}}
              originWhitelist={['*']}
              bounces={true}
              javaScriptEnabled
              cacheEnabled={true}
              geolocationEnabled={false}
              javaScriptEnabledAndroid={true}
              allowInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode={'compatibility'}
              scalesPageToFit
              source={{uri: `${iFrame}`}}
              startInLoadingState={true}
              useWebkit
              userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
              maxFontSizeMultiplier={1.4}
            />
          )}
          {chat}
        </SafeAreaView>
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
      <Button onPress={handleChatOff}>
        <Time maxFontSizeMultiplier={1.4}>Finalizar Atendimento</Time>
      </Button>
    </Container>
  );
}
