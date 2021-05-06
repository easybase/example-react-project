import './App.css';
import { EasybaseProvider, useEasybase } from 'easybase-react';
import { useEffect, useState } from "react";
import { HashRouter, Switch, Route, Link } from 'react-router-dom';
import ebconfig from './ebconfig';

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig} options={{ logging: true }}>
      <HashRouter>
        <div style={{ display: "flex", justifyContent: "space-evenly", borderBottom: "1px grey solid" }}>
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

function AuthButton() {
  const {
    isUserSignedIn,
    signIn,
    signOut,
    signUp,
  } = useEasybase();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const onAuthButtonClick = () => {
    if (isUserSignedIn()) {
      signOut();
    } else {
      setDialogOpen(true);
    }
  }

  const onSignInClick = async () => {
    const res = await signIn(usernameValue, passwordValue);
    if (res.success) {
      setDialogOpen(false);
      setUsernameValue("");
      setPasswordValue("");
    }
  }

  const onSignUpClick = async () => {
    const res = await signUp(usernameValue, passwordValue);
    if (res.success) {
      await signIn(usernameValue, passwordValue);
      setDialogOpen("");
      setUsernameValue("");
      setPasswordValue("");
    }
  }

  return (
    <>
      <button onClick={onAuthButtonClick} className="authButton">{isUserSignedIn() ? "Sign Out" : "Sign In"}</button>
      <div className={dialogOpen ? "authDialog authDialogOpen" : "authDialog"} onClick={_ => setDialogOpen(false)}>
        <div onClick={e => e.stopPropagation()}>
          <input type="text" placeholder="Username" value={usernameValue} onChange={e => setUsernameValue(e.target.value)} />
          <input type="password" placeholder="Password" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
          <div>
            <button style={{ marginRight: 10, marginTop: 14, fontSize: 16 }} onClick={onSignInClick}>Sign In</button>
            <button style={{ marginLeft: 10, marginTop: 14, fontSize: 16 }} onClick={onSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  )
}

function AddCardButton() {
  const { db } = useEasybase();

  const handleAddCardClick = async () => {
    try {
      const inLink = prompt("Please enter an Amazon link", "https://...");
      const inImage = prompt("Please enter an image link", "https://...");
      const inName = prompt("Please enter a product name", "");
      const inPrice = prompt("Please enter a price as a number", "14.24");
      if (!inPrice || !inName || !inImage || !inLink) return;

      await db('REACT DEMO').insert({
        amazon_link: inLink,
        product_name: inName,
        price: Number(inPrice),
        demo_image: inImage
      }).one();
    } catch (_) {
      alert("Error on input format")
    }
  }

  return <button onClick={handleAddCardClick} className="insertCardButton">+ Add Card</button>
}

function Home() {
  const [minPrice, setMinPrice] = useState(0);
  const { db, useReturn, e, isUserSignedIn } = useEasybase();

  const { frame } = useReturn(() => db("REACT DEMO")
    .return()
    .where(e.gt('price', minPrice)) // e.gt = "Greater Than"
    .limit(10),
  [minPrice]);

  const handleStarClick = (ele) => {
    if (isUserSignedIn()) {
      db("USER STARS").insert({ product_name: ele.product_name, amazon_link: ele.amazon_link }).one();
    }
  }

  const minPriceStyle = {
    position: "absolute",
    top: 74,
    right: 5
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <label style={minPriceStyle}>
        Minimum Price: 
        <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
      </label>
      {frame.map(ele =>
        <div className="cardRoot">
          <a href={ele.amazon_link}><img src={ele.demo_image} style={{ objectFit: "contain", height: 270, width: "100%", marginBottom: 10 }} /></a>
          <h4 style={{ textAlign: "center", borderTop: "1px grey solid", paddingTop: 15, margin: 0 }}>{ele.product_name}</h4>
          <p style={{ color: "green", textAlign: "end", fontWeight: 700 }}>${ele.price}</p>
          <button className="cardButton" onClick={() => handleStarClick(ele)}>⭐ Save for later ⭐</button>
        </div>
      )}
      <AddCardButton />
    </div>
  )
}

function Starred() {
  const [data, setData] = useState([]);

  const {
    db
  } = useEasybase();

  useEffect(() => {
    db('USER STARS', true).return().limit(10).all()
      .then(res => Array.isArray(res) && setData(res));
  }, [])

  return (
    <div style={{ display: "flex" }}>
      {data.map(ele =>
        <div className="cardRoot" style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
          <a href={ele.amazon_link}>{ele.product_name}</a>
        </div>
      )}
    </div>
  )
}

function FilterExample() {
  const {
    Query
  } = useEasybase()

  const [arr, setArr] = useState([]);

  useEffect(() => {
    Query({ queryName: "price filter", tableName: "REACT DEMO" }).then(res => {
      setArr(res);
    });
  }, [])

  return (
    <div style={{ display: "flex" }}>
      {arr.map(ele =>
        <div className="cardRoot">
          <a href={ele.amazon_link}><img src={ele.demo_image} style={{ objectFit: "contain", height: 270, width: "100%", marginBottom: 10 }} /></a>
          <h4 style={{ textAlign: "center", borderTop: "1px grey solid", paddingTop: 15, margin: 0 }}>{ele.product_name}</h4>
          <p style={{ color: "green", textAlign: "end", fontWeight: 700 }}>${ele.price}</p>
        </div>
      )}
    </div>
  )
}

export default App;
