// Barcodestock.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// === COLORS FROM YOUR GLOBAL PALETTE ===
const colors = {
  primary: {
    darkTeal: '#004d4d',
    deepTeal: '#006666',
    teal: '#008080',
    mediumTeal: '#00a0a0',
    brightTeal: '#26cccc',
    lightTeal: '#48d1cc',
    paleTeal: '#7fdfdf',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #004d4d 0%, #006666 50%, #008080 100%)',
    secondary: 'linear-gradient(135deg, #0d3333 0%, #1a4d4d 30%, #266666 70%, #339999 100%)',
    accent: 'linear-gradient(135deg, #008080 0%, #20b2aa 50%, #48d1cc 100%)',
    background: 'linear-gradient(135deg, #0f5959 0%, #1a7a7a 25%, #2d9999 50%, #4db8b8 75%, #66d9d9 100%)',
    dualTone: 'linear-gradient(145deg, #0d2626 0%, #1a4040 25%, #266666 50%, #4d9999 75%, #80cccc 100%)',
  },
  backgrounds: {
    main: 'linear-gradient(135deg, #0d4f4f 0%, #1a6b6b 30%, #2d8080 70%, #4a9999 100%)',
    page: 'linear-gradient(135deg, #0f5959 0%, #1a7a7a 25%, #2d9999 50%, #4db8b8 75%, #66d9d9 100%)',
    liquid: 'linear-gradient(135deg, #004d4d 0%, #006666 25%, #008080 50%, #00a0a0 75%, #26cccc 100%)'
  }
};

// Floating animation for background elements
const float = keyframes`
  0%, 100% { 
    transform: translate(0, 0) rotate(0deg) scale(1); 
  }
  33% { 
    transform: translate(30px, -30px) rotate(120deg) scale(1.1); 
  }
  66% { 
    transform: translate(-20px, 20px) rotate(240deg) scale(0.9); 
  }
`;

const Barcodestock = () => {
  const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const token = localStorage.getItem('access_token');
      const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      };
      if (data && (method === 'POST' || method === 'PUT' || method === 'GET')) {
        config.data = data;
      }
      const response = await axios(config);
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else if (response.status === 400) {
        return { success: false, error: 'Invalid data sent to server.', status: 400, data: response.data };
      } else if (response.status === 401) {
        return { success: false, error: 'Session expired. Please log in again.', status: 401, data: response.data };
      } else {
        return { success: false, error: 'Something went wrong. Try again.', status: response.status, data: response.data };
      }
    } catch (error) {
      return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
    }
  };

  const [formData, setFormData] = useState({
    startbarcode: '',
    endbarcode: '',
    createdby: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `${franchiseurl}stockbarcode/`,
        'POST',
        formData
      );
      setMessage(response.data.message);
      setFormData({ startbarcode: '', endbarcode: '', createdby: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullPageBackground>
      <AnimatedBackground>
        <FloatingShape delay="0s" />
        <FloatingShape delay="2s" />
        <FloatingShape delay="4s" />
      </AnimatedBackground>
      
      <ContentContainer>
        <FormCard>
          <Header>
            <Icon>🔖</Icon>
            <Title>Barcode Stock Entry</Title>
            <Subtitle>Enter barcode range to manage stock efficiently</Subtitle>
          </Header>
          
          {message && <Message>{message}</Message>}
          
          <Form onSubmit={handleSubmit} autoComplete="off">
            <InputGroup>
              <Label htmlFor="startbarcode">Start Barcode</Label>
              <Input
                id="startbarcode"
                type="text"
                name="startbarcode"
                value={formData.startbarcode}
                onChange={handleChange}
                placeholder="Eg: 000123"
                required
                autoComplete="off"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="endbarcode">End Barcode</Label>
              <Input
                id="endbarcode"
                type="text"
                name="endbarcode"
                value={formData.endbarcode}
                onChange={handleChange}
                placeholder="Eg: 000234"
                required
                autoComplete="off"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : <>💾 Save Barcode Stock</>}
            </SubmitButton>
          </Form>
        </FormCard>
      </ContentContainer>
    </FullPageBackground>
  );
};

// ====== STYLED COMPONENTS ======

const FullPageBackground = styled.div`
  height: 100vh;  /* Fixed height instead of min-height */
  width: 100vw;
  background: ${colors.gradients.liquid};
  position: fixed;  /* Fixed position to prevent any scroll */
  top: 0;
  left: 0;
  overflow: hidden;  /* Completely hide any overflow */
  
  /* Animated gradient background that shifts colors */
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* Enhanced gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(72, 209, 204, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 160, 160, 0.25) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const FloatingShape = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
  border-radius: 50%;
  animation: ${float} 20s ease-in-out infinite;
  animation-delay: ${props => props.delay};
  
  &:nth-child(1) {
    top: 10%;
    left: 15%;
    width: 80px;
    height: 80px;
  }
  
  &:nth-child(2) {
    top: 60%;
    right: 20%;
    width: 120px;
    height: 120px;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 25%;
    width: 90px;
    height: 90px;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;  /* Reduced padding */
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  max-width: 420px;  /* Slightly smaller max-width */
  width: 100%;
  padding: 2rem 1.5rem;  /* Reduced padding */
  position: relative;
  max-height: 90vh;  /* Ensure card doesn't exceed viewport */
  
  /* Glassmorphism effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${colors.gradients.secondary};
    opacity: 0.8;
    border-radius: 24px;
    z-index: -1;
  }
  
  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    border-radius: 20px;
    max-height: 95vh;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;  /* Reduced margin */
`;

const Icon = styled.div`
  font-size: 2.2rem;  /* Slightly smaller */
  margin-bottom: 0.4rem;
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled.h2`
  font-size: 1.8rem;  /* Slightly smaller */
  font-weight: bold;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;  /* Slightly smaller */
  opacity: 0.9;
`;

const Message = styled.div`
  text-align: center;
  margin-bottom: 1.2rem;  /* Reduced margin */
  color: #26cccc;
  font-weight: 500;
  background: rgba(38, 204, 204, 0.15);
  border: 1px solid rgba(38, 204, 204, 0.3);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;  /* Reduced padding */
  font-size: 0.95rem;  /* Slightly smaller */
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;  /* Reduced gap */
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;  /* Reduced gap */
`;

const Label = styled.label`
  font-weight: 600;
  color: ${colors.primary.lightTeal};
  font-size: 0.95rem;  /* Slightly smaller */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  padding: 0.9rem 1.1rem;  /* Reduced padding */
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 1rem;  /* Slightly smaller */
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${colors.primary.brightTeal};
    box-shadow: 0 0 0 3px rgba(38, 204, 204, 0.3);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  @media (max-width: 600px) {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
`;

const SubmitButton = styled.button`
  background: ${colors.gradients.accent};
  color: #fff;
  padding: 0.9rem;  /* Reduced padding */
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 0.3rem;  /* Reduced margin */
  transition: all 0.3s ease;
  font-size: 1rem;  /* Slightly smaller */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
  
  &:hover:not(:disabled) {
    background: ${colors.gradients.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 128, 128, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.div`
  width: 18px;  /* Slightly smaller */
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #26cccc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Barcodestock;
