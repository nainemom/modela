# Stringz

Javascript model library to work with objects.
To create model objects and check validations.

## Features

- Manual validation
- Type check
- Clean object

## Install

```bash
$ npm install modela --save
# or
$ yarn add modela
```

And then, import it:

```javascript
// ES2015+
import Modela from 'modela';

// CommonJS
var Modela = require('modela');
```

## Usage

### Create Model
```javascript
const user = new Modela({
  username: {
    type: 'string',
    validator: v => v.length >= 4,
    default: v => v + 'x'.repeat(4-v.length)
  },
  name: ['string', 'undefined'],
  birthday: 'date',
  city: {
    type: 'string',
    default: 'Tehran'
  },
  role: {
    type: 'string',
    validator: v => ['agent', 'user', 'admin'].indexOf(v) > -1,
    default: 'user',
    importer: v => v.replace('role: ', '').trim(),
    formatter: v => `role:${v}`,
    message: v => `role cannot be "${v}"! it should be one of agent, user or admin.`
  }
})
```

### $set
```javascript
const userObject = {
  username: 'n',
  name: 'Amir Momenian',
  birthday: new Date('27 sept 1992'),
  role: 'role: zeus'
}
user.$set(userObject)
```

### $check
```javascript
const userCheck = user.$check()
// userCheck = {
//   result: false,
//   errors: {
//     username: 'Illegal value!',
//     role: 'role cannot be "zeus"! it should be one of agent, user or admin.'
//   }
// }
})
```
### $clean
```javascript
const userClean = user.$clean()
// userClean = true
})
```

### $export
```javascript
const userExport = user.$export()
// userExport = {
//   username: 'nxxx',
//   name: 'Amir Momenian',
//   birthday: '1992-09-26T20:30:00.000Z',
//   city: 'Tehran',
//   role: 'role:user'
// }
})
```