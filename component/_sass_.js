'use strict';

const SASS_FILE = name => `
// ${name} Component Styles

@import '../../styles/core'

.${name}
  font-size: 3rem
`;

module.exports = SASS_FILE;
