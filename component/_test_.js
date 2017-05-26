'use strict';

const TEST_FILE = name => `
import React from 'react';
import ReactDOM from 'react-dom';
import ${name} from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${name} />, div);
});

it.skip('should fail', () => (
  new Promise((resolve, reject) => {
    reject();
  })
));
`;

module.exports = TEST_FILE;
