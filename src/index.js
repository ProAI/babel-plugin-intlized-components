const FUNCTION_NAME = 'defineTranslations';

const MESSAGES = Symbol('IntlizedComponentsMessages');

export default function () {
  return {
    pre(file) {
      if (!file.has(MESSAGES)) {
        file.set(MESSAGES, new Map());
      }
    },
    post(file) {
      // load messages
      const messages = [...file.get(MESSAGES).values()];

      // save messages in metadata
      // eslint-disable-next-line no-param-reassign
      file.metadata['intlized-components'] = { messages };
    },
    visitor: {
      CallExpression(path, state) {
        // check if expression is define translations function
        if (!path.referencesImport('intlized-components', FUNCTION_NAME)) {
          return;
        }

        // parse messages
        const scope = path.get('arguments')[0];
        const definitions = path.get('arguments')[1];
        definitions.get('properties').forEach((definition) => {
          // get messages
          const messages = state.file.get(MESSAGES);
          const id = `${scope.get('value')}.${definition.get('key')}`;
          const defaultMessage = definition.get('value');

          // temporarily store messages
          messages.set(id, {
            id,
            defaultMessage,
          });
        });
      },
    },
  };
}
