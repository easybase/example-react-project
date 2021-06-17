import { useState } from 'react';
import { useEasybase } from 'easybase-react';


export default function AuthButton() {
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
  