# scala-codegen

Scala code generator from [Scalameta](https://scalameta.org) AST.

## Install

```
npm i scala-codegen
```

## Usage

```js
const codegen = require('scala-codegen');

codegen.generate({
  type: 'Term.ApplyInfix',
  lhs: {
    type: 'Lit.Int', value: 1
  },
  op: {
    type: 'Term.Name', value: '+'
  },
  targs: [],
  args: [
    {
      type: 'Lit.Int', value: 2
    }
  ]
});
// => 1 + 2
```
