import React, {useState} from 'react';
import {RectButtonProps} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import Intl from 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import {AttendantDTO} from '../../../dtos/AttendantDTO';
import api from '../../../shared/services/api';
import {useAuth} from '../../../shared/hooks/globalContext';

import {
  ContainerWrapper,
  Container,
  Header,
  Title,
  Photo,
  Content,
  PricePerMinute,
  ButtonWrapper,
  Button,
  IconService,
  ChatIconService,
  PricePerMinuteText,
  Availability,
  AvailabilityWrapper,
  AvailabilityText,
  PerfilText,
} from './styles';

interface Props extends RectButtonProps {
  attendant: {
    index: number;
    item: AttendantDTO;
  };
}

interface CadastroProps {
  Codigo: string;
  Descricao: string;
  Experiencia: string;
  Foto: string;
  Frase: string;
  HorarioAtendimento: string;
  Link: string;
  Nome: string;
  Nota: number;
  Oraculos: string;
  Status: string;
}

interface ClientCommentsProps {
  Atendente: {
    Codigo: number;
    Foto: string;
    Link: string;
    Nome: string;
  };
  Cliente: {
    Codigo: number;
    Nome: string;
  };
  Depoimento: {
    Codigo: number;
    DataCadastro: Date;
    Nota: number;
    Texto: string;
  };
}

type NavProps = NavigationProp<ParamListBase>;

export function AttendantCard({attendant}: Props) {
  IconService.loadFont();
  ChatIconService.loadFont();

  const {item} = attendant;
  const navigation = useNavigation<NavProps>();
  const {user, selectedMode} = useAuth();
  const [loading, setLoading] = useState(false);
  const [minuteValue, setMinuteValue] = useState(0);
  const [cadastro, setCadastro] = useState<CadastroProps>({} as CadastroProps);
  const [clientComments, setClientComments] = useState<ClientCommentsProps[]>(
    [],
  );

  let attendantDescription = {};

  function handleAttendantDetails(mode: string) {
    setLoading(true);

    async function fetchAttendantDetail() {
      const {APIKEY} = process.env;
      try {
        api.defaults.headers.APIKEY = APIKEY;

        await api.get(`atendentes/${item.Cadastro.Codigo}/`).then(res => {
          const {Cadastro} = res.data;
          setCadastro(Cadastro);
          attendantDescription = Cadastro;
        });

        const {Codigo} = item.Cadastro;

        await api
          .get('depoimentos/', {
            params: {
              CodigoAtendente: Codigo,
            },
          })
          .then((response: any) => {
            const {Dados} = response.data;
            setLoading(false);
            setClientComments(Dados);
            // If mode selected navigate directly to Service.
            if (!mode) {
              navigation.navigate('DetailsOfAnAttendant', {
                screen: 'AttendantDetails',
                params: {
                  item,
                  clientComments: response.data,
                  attendantCard: attendantDescription,
                  mode,
                },
              });
            } else {
              let navOption: string = '';
              if (mode === 'chat') {
                navOption = 'ChatService';
              } else if (mode === 'call') {
                navOption = 'CallService';
              } else if (mode === 'videocam') {
                navOption = 'VideoService';
              } else {
                navOption = 'EmailService';
              }

              const pricePerMinute = item.ValorPorMinuto;

              if (pricePerMinute) {
                if (user.qtdcreditos > pricePerMinute * 3) {
                  Alert.alert(
                    'Saldo atual insuficiente.',
                    'Para realizar uma nova consulta com tempo hábil para perguntas e respostas, favor adquirir mais créditos!',
                  );
                  navigation.navigate('DetailsOfAnAttendant', {
                    screen: 'SelectedAttendant',
                    params: {attendant, mode},
                    previousScreen: 'AttendantCard',
                  });
                } else {
                  navigation.navigate('DetailsOfAnAttendant', {
                    screen: navOption,
                    params: {attendant},
                    previousScreen: 'AttendantCard',
                  });
                }
              }
            }
          });
      } catch (error) {
        console.log('Error:', error);
      } finally {
      }
    }
    fetchAttendantDetail();
  }

  function handleSelection(mode: string) {
    selectedMode(mode);
    handleAttendantDetails(mode);
  }

  return (
    <ContainerWrapper>
      <Container onPress={() => handleAttendantDetails('')}>
        <Header>
          <Title maxFontSizeMultiplier={1.2}>{item.Cadastro.Nome}</Title>
        </Header>

        <Content>
          {item.Cadastro.Foto ? (
            <Photo source={{uri: item.Cadastro.Foto}} />
          ) : (
            <Photo
              source={{
                uri: `https://ui-avatars.com/api/?name=${item.Cadastro.Nome}&length=1`,
              }}
            />
          )}
          <PricePerMinute>
            <PricePerMinuteText maxFontSizeMultiplier={1.4}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(item.ValorPorMinuto)}
              /min
            </PricePerMinuteText>
          </PricePerMinute>
          <ButtonWrapper accessible>
            {item.FormasAtt.Telefone === 'DISPONIVEL' && (
              <Button onPress={() => handleSelection('call')}>
                <IconService name="call" />
              </Button>
            )}
            {item.FormasAtt.Chat !== 'NAOATENDENTE' && (
              <Button onPress={() => handleSelection('chat')}>
                <ChatIconService name="chat" />
              </Button>
            )}
            {item.FormasAtt.Video === 'DISPONIVEL' && (
              <Button onPress={() => handleSelection('videocam')}>
                <IconService name="videocam" />
              </Button>
            )}
            {item.FormasAtt.Email !== 'NAOATENDENTE' && (
              <Button onPress={() => handleSelection('mail')}>
                <IconService name="mail" />
              </Button>
            )}
          </ButtonWrapper>
          <Availability>
            <AvailabilityWrapper>
              <AvailabilityText
                maxFontSizeMultiplier={1.4}
                type={item.Cadastro.Status}
                title={item.Cadastro.Status}>
                {item.Cadastro.Status}
              </AvailabilityText>
            </AvailabilityWrapper>
            <AvailabilityWrapper>
              <PerfilText maxFontSizeMultiplier={1.4}>Ver Perfil</PerfilText>
            </AvailabilityWrapper>
          </Availability>
        </Content>
      </Container>
    </ContainerWrapper>
  );
}
