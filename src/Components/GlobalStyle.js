import styled, { createGlobalStyle } from 'styled-components';

// Global Styles
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    color: #ffffff;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #006666, #00a0a0);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #00a0a0, #26cccc);
  }
`;

// Button Styles
export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #006666 0%, #00a0a0 50%, #26cccc 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 160, 160, 0.25);

  &:hover {
    background: linear-gradient(135deg, #00a0a0 0%, #26cccc 50%, #4dd9d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 160, 160, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 160, 160, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 2px solid #004d4d;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #004d4d 0%, #006666 50%, #008080 100%);
    border-color: #00a0a0;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 77, 77, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const AccentButton = styled.button`
  background: linear-gradient(135deg, #008080 0%, #20b2aa 50%, #48d1cc 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(32, 178, 170, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #20b2aa 0%, #48d1cc 50%, #7fdfdf 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(32, 178, 170, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Container Styles
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
`;

export const GradientCard = styled.div`
  background: linear-gradient(135deg, #0d3333 0%, #1a4d4d 30%, #266666 70%, #339999 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(13, 51, 51, 0.3);
  transition: all 0.3s ease;
`;

// Background Variants
export const PageBackground = styled.div`
  min-height: 100vh;
  position: relative;
`;

export const LiquidBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #004d4d 0%, #006666 25%, #008080 50%, #00a0a0 75%, #26cccc 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(72, 209, 204, 0.2) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(0, 160, 160, 0.15) 0%, transparent 50%);
    animation: float 25s ease-in-out infinite reverse;
    pointer-events: none;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }
`;

// Enhanced Container with Dark/Light Combination
export const DualToneCard = styled.div`
  background: linear-gradient(145deg, 
    #0d2626 0%, 
    #1a4040 25%, 
    #266666 50%, 
    #4d9999 75%, 
    #80cccc 100%
  );
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 
    0 10px 40px rgba(13, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(135deg, rgba(13, 38, 38, 0.8) 0%, rgba(26, 64, 64, 0.4) 100%);
    opacity: 0.9;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(135deg, rgba(77, 153, 153, 0.3) 0%, rgba(128, 204, 204, 0.6) 100%);
    opacity: 0.7;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 15px 50px rgba(13, 38, 38, 0.5),
      0 0 30px rgba(72, 209, 204, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

// Color Variables Export
export const colors = {
  primary: {
    darkTeal: '#004d4d',
    deepTeal: '#006666',
    teal: '#008080',
    mediumTeal: '#00a0a0',
    brightTeal: '#26cccc',
    lightTeal: '#48d1cc',
    paleTeal: '#7fdfdf'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #004d4d 0%, #006666 50%, #008080 100%)',
    secondary: 'linear-gradient(135deg, #0d3333 0%, #1a4d4d 30%, #266666 70%, #339999 100%)',
    accent: 'linear-gradient(135deg, #008080 0%, #20b2aa 50%, #48d1cc 100%)',
    background: 'linear-gradient(135deg, #0f5959 0%, #1a7a7a 25%, #2d9999 50%, #4db8b8 75%, #66d9d9 100%)',
    dualTone: 'linear-gradient(145deg, #0d2626 0%, #1a4040 25%, #266666 50%, #4d9999 75%, #80cccc 100%)'
  },
  backgrounds: {
    main: 'linear-gradient(135deg, #0d4f4f 0%, #1a6b6b 30%, #2d8080 70%, #4a9999 100%)',
    page: 'linear-gradient(135deg, #0f5959 0%, #1a7a7a 25%, #2d9999 50%, #4db8b8 75%, #66d9d9 100%)',
    liquid: 'linear-gradient(135deg, #004d4d 0%, #006666 25%, #008080 50%, #00a0a0 75%, #26cccc 100%)'
  }
};