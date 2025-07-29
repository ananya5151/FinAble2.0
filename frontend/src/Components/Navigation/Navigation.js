import React from 'react';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';

function Navigation({ 
  active, 
  setActive, 
  isListening, 
  startListening, 
  stopListening, 
  speechEnabled, 
  setSpeechEnabled, 
  speak 
}) {

  const handleMenuItemClick = (item) => {
    if (item.link.startsWith('/')) {
      setActive(item.id);
      speak(`Navigating to ${item.title}`);
    } else {
      window.open(item.link, '_blank');
      speak(`Opening ${item.title} in new tab`);
    }
  };

  return (
    <NavStyled>
      <div className="user-con">
        <img src={avatar} alt="User Avatar" />
        <div className="text">
          <h2>Mike</h2>
          <p>Your Money</p>
        </div>
      </div>
      
      {/* Voice Control Section */}
      <div className="voice-control">
        <h3>Voice Control</h3>
        <div className="voice-buttons">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          >
            {isListening ? '🎙️ Stop' : '🎙️ Listen'}
          </button>
          
          <button
            onClick={() => {
              setSpeechEnabled(!speechEnabled);
              speak(speechEnabled ? 'Speech disabled' : 'Speech enabled');
            }}
            className={`speech-btn ${speechEnabled ? 'enabled' : 'disabled'}`}
            aria-label={speechEnabled ? 'Disable speech' : 'Enable speech'}
          >
            {speechEnabled ? '🔊 On' : '🔇 Off'}
          </button>
        </div>
        
        <div className="voice-status">
          <div className="status-indicator">
            <div className={`indicator ${isListening ? 'active' : ''}`}></div>
            <span>{isListening ? 'Listening...' : 'Ready'}</span>
          </div>
        </div>
      </div>

      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => handleMenuItemClick(item)}
            className={active === item.id ? 'active' : ''}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
      
      <div className="bottom-nav">
        <li>
          {signout} Sign Out
        </li>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 374px;
  height: 100%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  
  .user-con{
    height: 100px;
    display: flex;
    align-items: center;
    gap: 1rem;
    img{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid #FFFFFF;
      padding: .2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }
    h2{
      color: rgba(34, 34, 96, 1);
    }
    p{
      color: rgba(34, 34, 96, .6);
    }
  }

  .voice-control {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem 0;
    
    h3 {
      color: var(--primary-color);
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
      text-align: center;
    }
    
    .voice-buttons {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      .voice-btn, .speech-btn {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 8px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }
      
      .voice-btn {
        background: #007bff;
        color: white;
        
        &.listening {
          background: #dc3545;
          animation: pulse 1s infinite;
        }
        
        &:hover {
          transform: translateY(-1px);
        }
      }
      
      .speech-btn {
        background: #28a745;
        color: white;
        
        &.disabled {
          background: #6c757d;
        }
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
    
    .voice-status {
      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--primary-color);
        
        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6c757d;
          transition: all 0.3s ease;
          
          &.active {
            background: #28a745;
            animation: blink 1s infinite;
          }
        }
      }
    }
  }

  .menu-items{
    flex: 1;
    display: flex;
    flex-direction: column;
    li{
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      margin: .6rem 0;
      font-weight: 500;
      cursor: pointer;
      transition: all .4s ease-in-out;
      color: rgba(34, 34, 96, .6);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      position: relative;
      
      &:hover {
        background: rgba(255, 255, 255, 0.5);
        transform: translateX(5px);
      }
      
      i{
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.4rem;
        transition: all .4s ease-in-out;
      }
    }
  }

  .active{
    color: rgba(34, 34, 96, 1) !important;
    background: rgba(255, 255, 255, 0.8) !important;
    
    i{
      color: rgba(34, 34, 96, 1) !important;
    }
    
    &::before{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #222260;
      border-radius: 0 10px 10px 0;
    }
  }
  
  .bottom-nav {
    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 10px;
      color: rgba(34, 34, 96, .6);
      
      &:hover {
        background: rgba(255, 255, 255, 0.5);
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;

export default Navigation;