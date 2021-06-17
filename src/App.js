import './App.css'
import { EasybaseProvider } from 'easybase-react'
import { HashRouter, Switch, Route, Link } from 'react-router-dom'
import ebconfig from './ebconfig'
import Home from './Home'
import AuthButton from './AuthButton'
import Starred from './Starred'
import FilterExample from './Filter' 

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig} options={{ logging: true }}>
      <HashRouter>
        <div className="header">
          <Link to="/"><h2>Home</h2></Link>
          <Link to="/starred"><h2>Starred</h2></Link>
          <Link to="/over100"><h2>Over 100</h2></Link>
        </div>
        <AuthButton />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/starred" exact>
            <Starred />
          </Route>
          <Route path="/over100" exact>
            <FilterExample />
          </Route>
        </Switch>
      </HashRouter>
    </EasybaseProvider>
  );
}

export default App;
