# 🌎 babel-plugin-intlized-components

Babel plugin for package [intlized-components](https://github.com/ProAI/intlized-components). The primary use case for this plugin is to extract message ids and default messages from all files of a project.

## Installation

```shell
npm install babel-plugin-intlized-components
# or
yarn add babel-plugin-intlized-components
```

## Usage

Add the plugin to your babel configuration:

```json
{
  "plugins": ["babel-plugin-styled-components"]
}
```

### Message extraction

```javascript
import babel from '@babel/core';

// Define fileName and babelConfig variables here.

const { metadata: result } = babel.transformFileSync(fileName, babelConfig);
const { translations } = result['intlized-components'];

// Do something with the translations, e.g. save them in file.
```

## Docs

### Options

#### `customImportKey`

If you don't import `createDict` from `intlized-components` directly, you can set a custom import key in the babel plugin, so that `createDict` is detected anyway.

Example:

In babel configuration:

```json
{
  "plugins": [
    [
      "babel-plugin-styled-components",
      { "customImportKey": "my-custom-import" }
    ]
  ]
}
```

In a file:

```javascript
import { createDict } from 'my-custom-import';

const dict = createDict(...);
```

#### `autoResolveKey`

Normally you have to set a key as the first parameter and a message object as the second parameter for `createDict`. If you set this option to the base path of your application, the babel plugin will derive the first parameter from the file name, so that you can call `createDict` with a message object only.

Example:

Without `autoResolveKey` option:

```javascript
const dict = createDict('welcome.Welcome', {
  hello: 'Hello',
});
```

With `autoResolveKey` option:

In babel configuration:

```json
{
  "plugins": [
    ["babel-plugin-styled-components", { "autoResolveKey": "path-to-my-app" }]
  ]
}
```

In file `welcome/Welcome.js`:

```javascript
// Babel will transform createDict and will add the key "welcome.Welcome" as first parameter to the function call.
const dict = createDict({
  hello: 'Hello',
});
```

_Hint: You can even set a key manually if this option is on, so you can mix up auto resolved and manually set keys._

## License

This package is released under the [MIT License](LICENSE).
