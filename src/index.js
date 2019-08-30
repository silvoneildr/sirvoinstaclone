import React from 'react';
import {StatusBar} from 'react-native';

import Routes from './routes';

export default function src() {
  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <Routes />
    </React.Fragment>
  );
}
