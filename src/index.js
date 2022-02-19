const nodePath = require('path');

const FUNCTION_NAME = 'createDict';

const isDefineTranslationsFunction = (path, state) => {
  const callee = path.get('callee');

  if (callee.node.name !== FUNCTION_NAME) {
    return false;
  }

  if (state.opts.ignoreImport) {
    return true;
  }

  if (
    callee.referencesImport('intlized-components', FUNCTION_NAME) ||
    callee.referencesImport(state.opts.customImportName, FUNCTION_NAME)
  ) {
    return true;
  }

  return false;
};

const getKey = (path) => path.node.name;
const getValue = (path) => path.evaluate().value;

export default function (babel) {
  return {
    pre(file) {
      file.set('translations', new Map());
    },
    post(file) {
      // load translations
      const translations = [...file.get('translations').values()];

      // save translations in metadata
      // eslint-disable-next-line no-param-reassign
      file.metadata['intlized-components'] = { translations };
    },
    visitor: {
      CallExpression(path, state) {
        // check if expression is define translations function
        if (!isDefineTranslationsFunction(path, state)) {
          return;
        }

        if (state.opts.autoResolveKey && path.node.arguments.length === 1) {
          if (!state.file.opts.filename) {
            throw new Error(
              'Filename not found by babel-plugin-intlized-components.',
            );
          }

          const key = nodePath
            .relative(state.opts.autoResolveKey, state.file.opts.filename)
            .replace(/\\/g, '/')
            .replace(/\//g, '.')
            .split('.')
            .slice(0, -1)
            .join('.');

          path.replaceWith(
            babel.types.callExpression(path.node.callee, [
              babel.types.stringLiteral(key),
              path.node.arguments[0],
            ]),
          );

          path.skip();
        }

        // parse translations
        const scope = path.get('arguments')[0];
        const definitions = path.get('arguments')[1];

        // temporarily store translations
        definitions.get('properties').forEach((definition) => {
          const translations = state.file.get('translations');
          const id = `${getValue(scope)}.${getKey(definition.get('key'))}`;
          const defaultMessage = getValue(definition.get('value'));

          translations.set(id, {
            id,
            defaultMessage,
          });
        });
      },
    },
  };
}
