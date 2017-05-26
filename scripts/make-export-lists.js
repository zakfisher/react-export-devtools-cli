'use strict';

/*
Output:
.exports.json // does not include demos
src
-- export
---- components.js
---- demos.js
---- docs.js
---- style.js
*/

const fs = require('fs');

const ROOT_FOLDER = process.env.PWD;
const EXPORT_FOLDER = `${ROOT_FOLDER}/src/export`;
const COMPONENTS_FOLDER = `${EXPORT_FOLDER}/components`;
const DEMOS_FOLDER = `${EXPORT_FOLDER}/demos`;

// Files created
const EXPORTS_JSON = `${ROOT_FOLDER}/.exports.json`;
const COMPONENTS_JS = `${EXPORT_FOLDER}/components.js`;
const DEMOS_JS = `${EXPORT_FOLDER}/demos.js`;
const DOCS_JS = `${EXPORT_FOLDER}/docs.js`;
const STYLE_JS = `${EXPORT_FOLDER}/style.js`;

module.exports = function makeExportLists() {

  // Read components directory
  fs.readdir(COMPONENTS_FOLDER, function(err, items) {

    let EXPORTS_LIST = {};

    let DOCS_FILE = '';
    let DOCS_OBJ = '';

    let COMPONENTS_FILE = '';
    let COMPONENTS_OBJ = '';

    let STYLE_FILE = '';

    const addBundle = (name, path) => {
      EXPORTS_LIST[name] = path;

      COMPONENTS_FILE += `import ${name} from './components/${name}';\n`;
      COMPONENTS_OBJ  += `COMPONENTS["${name}"] = ${name};\n`;

      DOCS_FILE  += `import ${name}Doc from './components/${name}/docs';\n`;
      DOCS_OBJ   += `DOCS["${name}"] = ${name}Doc;\n`;

      STYLE_FILE += `import './components/${name}/style.sass';\n`;
    };

    // Add bundles
    EXPORTS_LIST['style'] = `${EXPORT_FOLDER}/style.js`;
    items.map(name => {
      if (name.indexOf('.') !== -1) return false;
      addBundle(name, `${COMPONENTS_FOLDER}/${name}/index.js`);
    });

    // Write .exports.json
    fs.writeFileSync(EXPORTS_JSON, JSON.stringify(EXPORTS_LIST));

    // Write src/export/components.js
    COMPONENTS_FILE += `const COMPONENTS = {};\n${COMPONENTS_OBJ}\nexport default COMPONENTS;`;
    fs.writeFileSync(COMPONENTS_JS, COMPONENTS_FILE);

    // Write src/export/docs.js
    DOCS_FILE += `const DOCS = {};\n${DOCS_OBJ}\nexport default DOCS;`;
    fs.writeFileSync(DOCS_JS, DOCS_FILE);

    // Write src/export/components/style.js
    fs.writeFileSync(STYLE_JS, STYLE_FILE);
  });

  // Read demos directory
  fs.readdir(DEMOS_FOLDER, function(err, items) {
    let DEMOS_FILE = '';
    let DEMOS_OBJ = '';

    items.map(name => {
      if (name.indexOf('.js') === -1) return false;
      name = name.replace('.js', '');
      DEMOS_FILE  += `import ${name} from './demos/${name}.js';\n`;
      DEMOS_OBJ  += `DEMOS["${name}"] = ${name};`;
    });

    // Write src/app/demos.js
    DEMOS_FILE += `const DEMOS = {}; ${DEMOS_OBJ} export default DEMOS;`;
    fs.writeFileSync(DEMOS_JS, DEMOS_FILE);
  });
};
