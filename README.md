[![npm](https://img.shields.io/npm/v/pkg-install.svg?style=flat-square)](https://npmjs.com/package/pkg-install) [![npm](https://img.shields.io/npm/dt/pkg-install.svg?style=flat-square)](https://npmjs.com/package/pkg-install) [![npm](https://img.shields.io/npm/l/pkg-install.svg?style=flat-square)](/LICENSE) [![Build Status](https://travis-ci.org/dkundel/pkg-install.svg?branch=master)](https://travis-ci.org/dkundel/pkg-install) ![Codecov](https://img.shields.io/codecov/c/gh/dkundel/pkg-install.svg?style=flat-square)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

# pkg-install

> Easier installation of Node.js packages irrespective of the platform or package manager.

- Supports [npm](npmjs.com) and [yarn](yarnpkg.com)
- Easy to use promise-based API
- Uses [`execa`](npm.im/execa) under the hood

## Installation

```bash
npm install pkg-install
```

## Usage

```js
const { install } = require('pkg-install');

(async () => {
  const { stdout } = await install(
    {
      twilio: '^3.1',
      'node-env-run': '~1',
      'pkg-install': '*',
    },
    {
      dev: true,
      prefer: 'npm',
    }
  );
  console.log(stdout);
})();
```

## License

MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://dkundel.com"><img src="https://avatars3.githubusercontent.com/u/1505101?v=4" width="100px;" alt="Dominik Kundel"/><br /><sub><b>Dominik Kundel</b></sub></a><br /><a href="https://github.com/dkundel/pkg-install/commits?author=dkundel" title="Code">💻</a></td></tr></table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
