# react-markdown-loader

Convert markdown file to react component using markdown-it

## Feature

- import / export
- Write react component
- Use `{expression}`

## Installation

```sh
npm i @codpoe/react-markdown-loader -D
```

## Usage

### Config webpack

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.md$/,
                loader: [
                    'babel-loader',
                    '@codpoe/react-markdown-loader'
                ]
            }
        ]
    }
};
```

### Use markdown file as react component

```jsx
import Doc from './doc.md';

export default () => {
    return (
        <div>
            <Doc />
        </div>
    );
}
```

### Write import / export statement

import: 
```
:::import
```js
import { add } from './add.js';
    ```
:::
```

export:
```
:::export
```js
export const meta = {
    author: 'xxx',
    time: '2018-06-23'
};
    ```
:::
```

### Write react component

```
:::demo
```js
render() {
    return (
        <div>{add(1, 2)}</div>
    )
}
    ```
:::
```

> Note: The `demo` container will show the source code and its result on the page. If you just want to create a react component, please use `code` container instead. By the way, you can write any code you want in `code` container.

### Any code

```
:::code
```js
const foo = () => { console.log('😘'); }
    ```
:::
```

Then you can call `foo`, usually in demo components.

### Write `{expression}`

```js
6 + 6 = {6 + 6}
```

## Options

- className
  
  `string`. The class name of converted react component

- plugins

  `Array`. markdown-it plugins


