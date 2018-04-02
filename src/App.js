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
  render() {
    Analytics.record('appRender');
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
