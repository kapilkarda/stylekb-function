import React from 'react';
import Front from './front/front';
import Tshirt from './tshirt/tshirt';
import Mobile from './mobile/mobile';
import { Route, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <div>
          <Route path="/" component={Front} />
          <Route path="/tshirt" component={Tshirt} />
          <Route path="/mobile" component={Mobile} />
        </div>
      </Router>
    </div>
  );
}

export default App;
