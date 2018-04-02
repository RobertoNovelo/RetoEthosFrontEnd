import Amplify, { Analytics, Hub, Logger } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import React, { Component } from 'react';
import './App.css';
import aws_exports from './aws-exports';
import logo from './logo.svg';
const logger = new Logger('App');
Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', this, 'Auth Listener');
  }
  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === 'auth') {
      this.onAuthEvent(payload);
    }
  }
  onAuthEvent(payload) {
    const { event, data } = payload;
    Analytics.record(event);
    switch (event) {
      case 'signIn':
        logger.debug('user signed in');
        Analytics.updateEndpoint({
          UserAttributes: {
            username: data.username
          }
        });
        break;
      case 'signUp':
        logger.debug('user signed up');
        Analytics.updateEndpoint({
          UserAttributes: {
            username: data.username
          }
        });
        break;
      case 'signOut':
        logger.debug('user signed out');
        Analytics.updateEndpoint({
          UserAttributes: null
        });
        break;
      case 'signIn_failure':
        logger.debug('user sign in failed');
        Analytics.updateEndpoint({
          UserAttributes: null
        });
        break;
      default:
        logger.error('unexpected auth event');
        Analytics.updateEndpoint({
          UserAttributes: null
        });
        break;
    }
    console.log(data);
  }
  componentDidMount() {
    console.log(
      'El teléfono debe tener el código del país para recibir el SMS de confirmación (+52 para MX) :D!'
    );
  }
  render() {
    Analytics.record('appRender');
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Mientras como ciudadano realizas una auditoría a un contrato, la
            página se mantiene "mineando una cripto moneda".
          </h1>
        </header>
        <p className="App-intro">
          El valor de dicha moneda se valúa conforme al impacto de remover la
          corrupción y se otorgará al ciudadano siempre y cuando alimente al
          sistema, es decir, no solo se otorga por mantener una ventana abierta
          en su explorador. Mientras más puntos o experiencia tenga el usuario,
          mayor será la cantidad y complejidad de auditoriías disponibles. Se
          plantea un sistema como duolinguo o codecademy.
        </p>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
