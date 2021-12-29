/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import api from '../../../shared/services/api';
import {Alert, Dimensions, Platform} from 'react-native';

import LogoSvg from '../../../assets/tarotonline_logo.svg';

import Intl from 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import redeImg from '../../../assets/rede.png';
import paymeeImg from '../../../assets/paymee_big.png';
import paypalImg from '../../../assets/paypal_big.png';
import pagseguroImg from '../../../assets/pagseguro.png';
import pixImg from '../../../assets/pix_big.png';
import barcodeImg from '../../../assets/barcode_big.png';
import tarotImg from '../../../assets/tarot_big.png';
import creditImg from '../../../assets/credit_big.png';
import bankImg from '../../../assets/bank_big.png';

import {
  Container,
  Header,
  BackButton,
  Icon,
  LogoView,
  SafeView,
  CardIcon,
  IconView,
  IconText,
  CreditImage,
  BankImage,
  SelectionText,
  Content,
  Box,
  BoxLogo,
  ImageIcon,
  BoxCards,
  BoxTimeToRelease,
  TimeToReleaseTextText,
  CardView,
  CardText,
  MultiCardView,
  IconCardView,
} from './styles';

type NavProps = NavigationProp<ParamListBase>;

export function PaymentOptions({route}: any) {
  const {attendant, price, paymentMethods} = route.params;
  const {width} = Dimensions.get('window');
  const navigation = useNavigation<NavProps>();

  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL',
  });

  function handlePayment(mode: string) {
    let packetCode: string;

    if (mode === 'tarotonline') {
      packetCode = 'DEP';
    } else {
      packetCode = mode;
    }

    async function callAPI() {
      try {
        await api
          .post(`comprar-pacotes-creditos/${price[0].Codigo}/`, {
            CodigoFormaPagamento: packetCode,
          })
          .then(res => {
            const {Link} = res.data;
            navigation.navigate('PaymentWebView', {
              price,
              Link,
              attendant,
              paymentMethods,
            });
          });
        // } else {
        //   Alert.alert(
        //     "Forma de Pagamento Não Disponível:",
        //     "Cliente entrou com login social e não possui Token!")
        // }
      } catch (error) {
        console.log(error);
        Alert.alert('opção escolhida não disponível no momento.', '!');
      }
    }
    callAPI();
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" />
        </BackButton>
        <LogoView>
          <LogoSvg width={width / 1.6} />
        </LogoView>
      </Header>
      <SafeView>
        <IconView>
          <CardIcon />
          <IconText maxFontSizeMultiplier={1}>
            {formatter.format(price[0].Valor)}
          </IconText>
        </IconView>
      </SafeView>
      <SafeView>
        <SelectionText maxFontSizeMultiplier={1.6}>
          Selecione a forma de pagamento
        </SelectionText>
      </SafeView>
      <Content>
        <Box onPress={() => handlePayment('Rede_Credito')}>
          <BoxLogo>
            <ImageIcon source={redeImg} style={{marginTop: -12}} />
          </BoxLogo>
          <BoxCards>
            <CardView>
              <CreditImage source={creditImg} />
              <CardText maxFontSizeMultiplier={1.2}>Cartão de Crédito</CardText>
            </CardView>
            <BoxTimeToRelease style={{marginTop: -5}}>
              <TimeToReleaseTextText maxFontSizeMultiplier={1.2}>
                Liberação imediata
              </TimeToReleaseTextText>
            </BoxTimeToRelease>
          </BoxCards>
        </Box>
        <Box onPress={() => handlePayment('PAYMEE')}>
          <BoxLogo>
            <ImageIcon source={paymeeImg} style={{marginTop: 2}} />
          </BoxLogo>
          <BoxCards>
            <MultiCardView>
              <IconCardView>
                <BankImage source={bankImg} />
                <CardText maxFontSizeMultiplier={1.2} style={{marginTop: 18}}>
                  Transferência
                </CardText>
              </IconCardView>
              <IconCardView>
                <ImageIcon
                  source={pixImg}
                  style={{marginTop: -8, marginLeft: 6}}
                />
                <CardText
                  maxFontSizeMultiplier={1.4}
                  style={{marginTop: 0 - 4, marginLeft: 6}}>
                  Pix
                </CardText>
              </IconCardView>
              <BoxTimeToRelease>
                <TimeToReleaseTextText maxFontSizeMultiplier={1.2}>
                  Liberação de 5 a 30 minutos
                </TimeToReleaseTextText>
              </BoxTimeToRelease>
            </MultiCardView>
          </BoxCards>
        </Box>
        <Box onPress={() => handlePayment('PAYPAL')}>
          <BoxLogo>
            <ImageIcon source={paypalImg} />
          </BoxLogo>
          <BoxCards>
            <CardView>
              <CreditImage source={creditImg} />
              <CardText maxFontSizeMultiplier={1.2}>Cartão de Crédito</CardText>
            </CardView>
            <BoxTimeToRelease style={{marginTop: -5}}>
              <TimeToReleaseTextText maxFontSizeMultiplier={1.2}>
                Liberação imediata
              </TimeToReleaseTextText>
            </BoxTimeToRelease>
          </BoxCards>
        </Box>
        <Box onPress={() => handlePayment('PAGSEGURO')}>
          <BoxLogo>
            <ImageIcon source={pagseguroImg} />
          </BoxLogo>
          <BoxCards>
            <MultiCardView>
              <IconCardView>
                <CreditImage source={creditImg} />
                <CardText maxFontSizeMultiplier={1.2} style={{marginTop: 5}}>
                  Cartão de Crédito
                </CardText>
              </IconCardView>
              <IconCardView>
                <ImageIcon
                  source={pixImg}
                  style={{marginTop: -10, marginLeft: 8}}
                />
                <CardText
                  maxFontSizeMultiplier={1.2}
                  style={{marginTop: -6, marginLeft: 8}}>
                  Pix
                </CardText>
              </IconCardView>
              <IconCardView>
                <ImageIcon
                  source={barcodeImg}
                  style={{marginTop: -8, marginLeft: 10}}
                />
                <CardText
                  maxFontSizeMultiplier={1.2}
                  style={{marginTop: -8, marginLeft: 12}}>
                  Boleto
                </CardText>
              </IconCardView>
              <BoxTimeToRelease style={{marginTop: 4}}>
                <TimeToReleaseTextText maxFontSizeMultiplier={1.2}>
                  Liberação após aprovação
                </TimeToReleaseTextText>
              </BoxTimeToRelease>
            </MultiCardView>
          </BoxCards>
        </Box>
        <Box onPress={() => handlePayment('tarotonline')}>
          <BoxLogo>
            <ImageIcon source={tarotImg} />
          </BoxLogo>
          <BoxCards>
            <MultiCardView>
              <IconCardView>
                <BankImage source={bankImg} style={{marginTop: 6}} />
                <CardText maxFontSizeMultiplier={1.2} style={{marginTop: 10}}>
                  Transferência
                </CardText>
              </IconCardView>
              <IconCardView>
                <ImageIcon
                  source={pixImg}
                  style={{marginTop: -14, marginLeft: 6}}
                />
                <CardText
                  maxFontSizeMultiplier={1.2}
                  style={{marginTop: -10, marginLeft: 6}}>
                  Pix
                </CardText>
              </IconCardView>
            </MultiCardView>
            <BoxTimeToRelease style={{marginTop: 2}}>
              <TimeToReleaseTextText
                maxFontSizeMultiplier={1.2}
                style={{padding: 0}}>
                Liberação após aprovação via WhatsApp
              </TimeToReleaseTextText>
            </BoxTimeToRelease>
          </BoxCards>
        </Box>
      </Content>
    </Container>
  );
}
