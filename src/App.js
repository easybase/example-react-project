import './App.css';
import { EasybaseProvider, useEasybase } from 'easybase-react';
import { useEffect } from "react";
import { HashRouter, Switch, Route, Link } from 'react-router-dom';
import ebconfig from './ebconfig';

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <HashRouter>
        <div style={{ display: "flex", justifyContent: "space-evenly", borderBottom: "1px grey solid" }}>
          <Link to="/"><h2>Home</h2></Link>
          <Link to="/starred"><h2>Starred</h2></Link>
        </div>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/starred" exact>
            <p>Starred Products</p>
          </Route>
        </Switch>
      </HashRouter>
    </EasybaseProvider>
  );
}

function Home() {
  const {
    configureFrame,
    sync,
    Frame
  } = useEasybase();

  useEffect(() => {
    configureFrame({ limit: 10, offset: 0, tableName: "REACT DEMO" });
    sync();
  }, [])

  const cardRootStyle = {
    width: 250,
    height: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    margin: 30,
    padding: "0 10px"
  }

  const buttonStyle = {
    paddingTop: 3,
    fontSize: 16,
    cursor: "pointer",
    display: "inline-block",
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: 500,
  }

  return (
    <div style={{ display: "flex" }}>
      {Frame().map(ele => 
        <div style={cardRootStyle}>
          <img src={ele.demo_image} style={{ objectFit: "contain", height: 270, width: "100%", marginBottom: 10 }} />
          <h4 style={{ textAlign: "center", borderTop: "1px grey solid", paddingTop: 15, margin: 0 }}>{ele.product_name}</h4>
          <p style={{ color: "green", textAlign: "end", fontWeight: 700 }}>${ele.price}</p>
          <button style={buttonStyle} onClick={() => {}}>⭐ Save for later ⭐</button>
        </div>
      )}
    </div>
  )
}

export default App;
