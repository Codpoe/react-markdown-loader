# heading 1
## heading 2
### heading 3

__test__

_test_

class=😄

<div style={{ marginLeft: '200px' }}>😄</div>

6 + 6 = {6 + 6}

> quote

::: react import
```js
import { add } from './add.js';
```
:::

::: react demo
```jsx
constructor(props) {
    super(props);
    this.state = {
        bgColor: 'red'
    };
}

handleClick = () => {
    this.setState(({ bgColor }) => {
        return {
            bgColor: bgColor === 'red' ? 'green' : 'red'
        };
    });
}

render() {
    const { bgColor } = this.state;
    const test = 'testclass=';
    return (
        <div
            style={{ backgroundColor: bgColor }}
            onClick={this.handleClick}
        >
            {add(1, 2)}
        </div>
    );
}
```
:::

::: react demo
```jsx
render() {
    return <div onClick={() => { console.log('😄'); }}>{`1`}</div>;
}
```
:::
