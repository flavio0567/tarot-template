import React, {useState, useEffect} from 'react';
import {MotiView} from 'moti';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import he from 'he';
import {format, parse} from 'date-fns';
import {Rating} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {useTheme} from 'styled-components';
import {SafeAreaView} from 'react-native';
import {useAuth} from '../../../shared/hooks/globalContext';

import {
  Container,
  PhotoWrapper,
  Photo,
  Title,
  BackButton,
  Icon,
  StatusWrapper,
  IconStart,
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
  CommentView,
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
  const {mode, selectedMode} = useAuth();
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function handleSelection(mode: string) {
    selectedMode(mode);
    navigation.navigate('SelectedAttendant', {mode, attendant});
  }

  return (
    <MotiView
      delay={200}
      from={{
        opacity: 0,
        translateY: 0,
      }}
      animate={{
        opacity: 1,
        translateY: -300,
      }}
      transition={{
        type: 'timing',
        duration: 2000,
      }}>
      <Container>
        <AttendantWrapper>
          <PhotoWrapper>
            <Photo source={{uri: `${attendantDetails.Foto}`}} />
            <StatusWrapper>
              <Availability
                maxFontSizeMultiplier={1.4}
                type={attendantDetails.Status}>
                {attendantDetails.Status}
              </Availability>
              {attendant.Cadastro.Nota && (
                <Rating
                  readonly
                  imageSize={20}
                  startingValue={attendant.Cadastro.Nota}
                />
              )}
            </StatusWrapper>
          </PhotoWrapper>
          <Attendant>
            <AttendantName>
              <Title maxFontSizeMultiplier={1.4}>
                {attendant.Cadastro.Nome}
              </Title>

              <BackButton onPress={() => navigation.goBack()} />
            </AttendantName>
            <AttendantDescription>
              <ProfileDetailsText maxFontSizeMultiplier={1.4}>
                {description}
              </ProfileDetailsText>
            </AttendantDescription>
            <ButtonWrapper>
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
                      color:
                        mode === 'videocam' ? theme.colors.secondary : '#fff',
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
          </Attendant>
        </AttendantWrapper>
        <Separator>
          <SeparatorText maxFontSizeMultiplier={1.4}>Horário</SeparatorText>
        </Separator>
        <TimeTableText maxFontSizeMultiplier={1.4}>{timeTable}</TimeTableText>
        <Separator>
          <SeparatorText maxFontSizeMultiplier={1.4}>Oráculos</SeparatorText>
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
    </MotiView>
  );
}
