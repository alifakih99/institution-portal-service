import React, { useState } from 'react';
import './../style/Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordMasking = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSavedUsernameFocus = () => {
    addFocus(document.getElementById("username-span"));
    revertBorderColor(document.getElementById("div-username"));
  }

  const handleSavedPasswordFocus = () => {
    addFocus(document.getElementById("password-span"));
    revertBorderColor(document.getElementById("div-password"));
  }

  const handleUsernameFocus = () => {
    changeBorderColor(document.getElementById("div-username"));
    changeColor(document.getElementById("username-span"));
    addFocus(document.getElementById("username-span"));
  }

  const handleUsernameBlur = () => {
    if (username.length !== 0) {
      handleSavedUsernameFocus();
      revertColor(document.getElementById("username-span"));
      return;
    }
    revertBorderColor(document.getElementById("div-username"));
    revertColor(document.getElementById("username-span"));
    removeFocus(document.getElementById("username-span"));
  }

  const handlePasswordFocus = () => {
    changeBorderColor(document.getElementById("div-password"));
    changeColor(document.getElementById("password-span"));
    addFocus(document.getElementById("password-span"));
  }

  const handlePasswordBlur = () => {
    if (password.length !== 0) {
      handleSavedPasswordFocus();
      revertColor(document.getElementById("password-span"));
      return;
    }
    revertBorderColor(document.getElementById("div-password"));
    revertColor(document.getElementById("password-span"));
    removeFocus(document.getElementById("password-span"));
  }

  const addFocus = (element) => {
    element.style.transform = 'translate(14px, -12px) scale(0.75)';
    element.style.backgroundColor = 'white';
    element.style.paddingLeft = '10px';
    element.style.paddingRight = '10px';
  }

  const removeFocus = (element) => {
    element.style.transform = '';
    element.style.backgroundColor = '';
    element.style.paddingLeft = '';
    element.style.paddingRight = '';
  }

  const changeColor = (element) => {
    element.style.color = 'rgba(78, 54, 245, 1)';
  }

  const revertColor = (element) => {
    element.style.color = '';
  }

  const changeBorderColor = (element) => {
    element.style.borderColor = 'rgba(78, 54, 245, 1)';
  }

  const revertBorderColor = (element) => {
    element.style.borderColor = '';
  }

  const login = () => {
    if (username === null || username === undefined || username.length === 0) {
      document.getElementById("login-alert").style.opacity = 1;
      document.getElementById("login-msg-result").textContent = 'Please fill your username';
      return;
    }

    if (password === null || password === undefined || password.length === 0) {
      document.getElementById("login-alert").style.opacity = 1;
      document.getElementById("login-msg-result").textContent = 'Please fill your password';
      return;
    }

    document.getElementById('loading-spinner').style.display = 'inline-flex';
    document.getElementById("login-alert").style.opacity = 0;
    document.getElementById("login-msg-result").textContent = '';
    const loggingIn = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/api/v1/auth/login',
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          });
        if (response.ok) {
          const rsp = await response.json();
          const status = rsp.status;
          const msg = rsp.message;
          if (!status) {
            document.getElementById("login-alert").style.opacity = 1;
            document.getElementById("login-msg-result").textContent = msg;
            document.getElementById('loading-spinner').style.display = 'none';
            return;
          }
          const data = rsp.data;
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          localStorage.setItem('expired_after', data.expiresIn);
          navigate('/');
        }
      }
      catch (error) {
      }
    }
    loggingIn();
  }

  return (
    <div className="login">
      <div className='left-container'>
        <div className='naviagation-bar'>
          <a href='#'>
            <img alt='' src='%PUBLIC_URL%/../../itgholding.jpg' />
          </a>
        </div>
        <div className='login-container'>
          <div className='login-form'>
            <div className='header-login-form'>
              <h4>Welcome To ITG Holding</h4>
            </div>
            <div className='content-login-form'>
              <div id='div-username' className='div-username'>
                <span id='username-span'>Username</span>
                <div className='username-input'>
                  <input type="text" value={username} autoComplete="off" required onChange={handleUsernameChange} onFocus={handleUsernameFocus} onBlur={handleUsernameBlur} />
                </div>
              </div>
              <div id='div-password' className='div-password'>
                <span id='password-span'>Password</span>
                <div className='password-input'>
                  <input id="passwordInput" value={password} type={passwordVisible ? "text" : "password"} autoComplete="off" required onChange={handlePasswordChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} />
                  <div className="eye-container">
                    <button id="togglePassword" aria-label={passwordVisible ? "Hide password" : "Show password"} onClick={handlePasswordMasking}>
                      <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} className="eye-icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div className='button'>
                <button onClick={login}>
                  LOGIN
                  <div id="loading-spinner" className="spinner"></div>
                </button>
              </div>

              <div id='login-alert' className='alert'>
                <div className='left-alert'>
                  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SuccessOutlinedIcon"><path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path></svg>
                </div>
                <div className='right-alert'>
                  <span id="login-msg-result" className='message'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
export default LoginPage;