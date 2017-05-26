'use strict';

const INDEX_FILE = name => `
/**
  ${name} Component
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.sass';

const GREETINGS = [
  'Hello, My name is ${name}.',
  "What's happening? #${name}",
  'Yolo and stuff, ${name}'
];

class ${name} extends Component {
  constructor() {
    super();

    this.state = {
      greetingIndex: 0
    };

    this.setGreeting = this.setGreeting.bind(this);
  }

  static propTypes = {
    color: PropTypes.string
  };

  static defaultProps = {
    color: '#ee528f'
  };

  setGreeting() {
    let newIndex = this.state.greetingIndex + 1;
    if (newIndex === GREETINGS.length) newIndex = 0;
    this.setState({ greetingIndex: newIndex });
  }

  render() {
    const style = { color: this.props.color };
    return (
      <div className='${name}'
        style={style}
        onClick={this.setGreeting}>
        {GREETINGS[this.state.greetingIndex]}
      </div>
    );
  }
}

window.AudiReact = window.AudiReact || {};
export default window.AudiReact.${name} = ${name};
`;

module.exports = INDEX_FILE;
