import React from 'react';
import { render } from 'react-dom';

import Doc from './doc.md';

const App = () => (
  <div>
    <Doc />
  </div>
);

render(<App />, document.getElementById('root'));
