import React, {useState, useEffect} from 'react';
import {SafeAreaView, StatusBar, Alert} from 'react-native';

import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import he from 'he';
import {format, parse} from 'date-fns';
import {Rating} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {useTheme} from 'styled-components';
import {useAuth} from '../../../shared/hooks/globalContext';

import {
  Container,
  Photo,
  Title,
  BackButton,
  Icon,
  StatusWrapper,
  ChatIconService,
  Availability,
  AttendantWrapper,
  Attendant,
  AttendantName,
  AttendantDescription,
  ProfileDetailsText,
  ButtonWrapper,
  Button,
  Separator,
  SeparatorText,
  TimeTableText,
  CommentHeader,
  CommentNameView,
  CommentedBy,
  CommentDate,
  Comments,
  CommentsWrapper,
} from './styles';

type NavProps = NavigationProp<ParamListBase>;

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

export function AttendantDetails({route}: any) {
  const {item: attendant, clientComments, attendantCard} = route.params;
  const navigation = useNavigation<NavProps>();
  const {user, mode, selectedMode} = useAuth();
  const theme = useTheme();
  const description = sanitizeHTML(attendantCard.Descricao);
  const timeTable = attendantCard.HorarioAtendimento;
  const oracle = attendantCard.Oraculos;

  const {Cadastro} = attendant;
  const comments = clientComments.Dados;
  const [attendantDetails, setAttendantDetails] = useState<CadastroProps>(
    {} as CadastroProps,
  );

  useEffect(() => {
    setAttendantDetails(Cadastro);

    clientComments.Dados.map((item: any) => {
      return (
        item.Atendente,
        item.Client,
        he.decode(item.Cliente.Nome.replace(/<[^>]*>?/gm, '')),
        item.Depoimento,
        (item.Depoimento.DataCadastro = format(
          parse(
            item.Depoimento.DataCadastro,
            'yyyy-MM-dd HH:mm:ss',
            new Date(),
          ),
          'dd/MM/yyyy hh:mm',
        )),
        he.decode(item.Depoimento.Texto.replace(/<[^>]*>?/gm, ''))
      );
    });
  }, [Cadastro, clientComments.Dados]);

  function sanitizeHTML(text: string) {
    let sanitizedText = text.replace(/<[^>]*>?/gm, '');
    return he.decode(sanitizedText);
  }

  function handleSelection(modeSelected: string) {
    selectedMode(modeSelected);

    const pricePerMinute = attendant.ValorPorMinuto;

    if (pricePerMinute) {
      let serviceCompare: number;

      if (modeSelected === 'mail') {
        serviceCompare = 49.9;
      } else {
        serviceCompare = pricePerMinute * 3;
      }

      if (user.qtdcreditos < serviceCompare) {
        Alert.alert(
          'Saldo atual insuficiente.',
          'Para realizar uma nova consulta com tempo h??bil para perguntas e respostas, favor adquirir mais cr??ditos!',
        );
        navigation.navigate('DetailsOfAnAttendant', {
          screen: 'SelectedAttendant',
          params: {attendant: {item: attendant}, modeSelected},
          previousScreen: 'AttendantDetails',
        });
      } else {
        navigation.navigate('SelectedAttendant', {modeSelected, attendant});
      }
    } else {
      Alert.alert(
        'Consulta n??o dispon??vel:',
        'N??o foi poss??vel obter o seu saldo, tente novamente!',
      );
    }
  }

  return (
    <Container>
      <StatusBar backgroundColor={theme.colors.primary_dark} />
      <AttendantWrapper>
        <Attendant>
          <AttendantName>
            <Photo source={{uri: `${attendantDetails.Foto}`}} />
            <Title maxFontSizeMultiplier={1.4}>{attendant.Cadastro.Nome}</Title>

            <BackButton onPress={() => navigation.goBack()}>
              <Icon name="close-outline" style={{fontSize: 28}} />
            </BackButton>
          </AttendantName>
        </Attendant>
        <AttendantDescription>
          <ProfileDetailsText maxFontSizeMultiplier={1.4}>
            {description}
          </ProfileDetailsText>
        </AttendantDescription>
      </AttendantWrapper>
      <ButtonWrapper>
        <StatusWrapper>
          <Availability
            maxFontSizeMultiplier={1.4}
            type={attendantDetails.Status}>
            {attendantDetails.Status}
          </Availability>
          {attendant.Cadastro.Nota && (
            <Rating
              readonly
              imageSize={18}
              startingValue={attendant.Cadastro.Nota}
            />
          )}
        </StatusWrapper>
        {attendant.FormasAtt.Telefone === 'DISPONIVEL' && (
          <Button onPress={() => handleSelection('call')}>
            <Icon
              name="call"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                color: mode === 'call' ? theme.colors.secondary : '#fff',
                top: 6,
              }}
            />
          </Button>
        )}
        {attendant.FormasAtt.Chat !== 'NAOATENDENTE' && (
          <Button onPress={() => handleSelection('chat')}>
            <ChatIconService
              name="chat"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                color: mode === 'chat' ? theme.colors.secondary : '#fff',
                top: 2,
              }}
            />
          </Button>
        )}
        {attendant.FormasAtt.Video === 'DISPONIVEL' && (
          <Button onPress={() => handleSelection('videocam')}>
            <Icon
              name="videocam"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                color: mode === 'videocam' ? theme.colors.secondary : '#fff',
                top: 4,
              }}
            />
          </Button>
        )}
        {attendant.FormasAtt.Email !== 'NAOATENDENTE' && (
          <Button onPress={() => handleSelection('mail')}>
            <Icon
              name="mail"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                color: mode === 'mail' ? theme.colors.secondary : '#fff',
                top: 4,
              }}
            />
          </Button>
        )}
      </ButtonWrapper>
      <Separator>
        <SeparatorText maxFontSizeMultiplier={1.4}>Hor??rio</SeparatorText>
      </Separator>
      <TimeTableText maxFontSizeMultiplier={1.4}>{timeTable}</TimeTableText>
      <Separator>
        <SeparatorText maxFontSizeMultiplier={1.4}>Or??culos</SeparatorText>
      </Separator>
      <TimeTableText maxFontSizeMultiplier={1.4}>{oracle}</TimeTableText>
      <Separator>
        <SeparatorText maxFontSizeMultiplier={1.4}>Depoimentos</SeparatorText>
      </Separator>
      <SafeAreaView style={{height: 300}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{paddingBottom: 20}}
          style={{height: 500, paddingBottom: 20}}
          data={comments}
          keyExtractor={comment => comment.Depoimento.DataCadastro}
          renderItem={({item: comment}) => (
            <CommentsWrapper key={comment.index}>
              <CommentHeader>
                <CommentNameView>
                  <CommentedBy maxFontSizeMultiplier={1.2}>
                    {comment.Cliente.Nome}
                  </CommentedBy>
                </CommentNameView>
                <CommentDate maxFontSizeMultiplier={1.2}>
                  {comment.Depoimento.DataCadastro}
                </CommentDate>
                <Rating
                  readonly
                  imageSize={12}
                  startingValue={comment.Depoimento.Nota}
                  maxFontSizeMultiplier={1.2}
                />
              </CommentHeader>
              <Comments maxFontSizeMultiplier={1.2}>
                {comment.Depoimento.Texto}
              </Comments>
            </CommentsWrapper>
          )}
        />
      </SafeAreaView>
    </Container>
  );
}
