// Barcodestock.js
import React, { useState, useEffect } from 'react';
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
      if (response.status >= 200 && response.status < 300) {
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
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // === Barcode list / table state ===
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [barcodeList, setBarcodeList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [editRows, setEditRows] = useState({}); // { [barcode_id]: { startbarcode, endbarcode } }
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchBarcodeList = async (dateValue) => {
    setIsTableLoading(true);
    const response = await apiRequest(
      `${franchiseurl}getandupdatebarcode/?date=${dateValue}`,
      'GET'
    );
    if (response.success) {
      setBarcodeList(Array.isArray(response.data) ? response.data : []);
    } else {
      setIsError(true);
      setMessage(response.error);
      setBarcodeList([]);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchBarcodeList(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getFieldValue = (row, field) =>
    editRows[row.barcode_id]?.[field] ?? row[field];

  const handleEditChange = (barcode_id, field, value) => {
    setEditRows((prev) => ({
      ...prev,
      [barcode_id]: {
        ...prev[barcode_id],
        [field]: value,
      },
    }));
  };

  const handleUpdateRow = async (row) => {
    setUpdatingId(row.barcode_id);
    const payload = {
      barcode_id: row.barcode_id,
      startbarcode: getFieldValue(row, 'startbarcode'),
      endbarcode: getFieldValue(row, 'endbarcode'),
      modifedby: localStorage.getItem('username') || '',
    };

    const response = await apiRequest(
      `${franchiseurl}getandupdatebarcode/`,
      'PUT',
      payload
    );

    if (response.success) {
      setIsError(false);
      setMessage(response.data?.message || 'Barcode updated successfully');
      setEditRows((prev) => {
        const copy = { ...prev };
        delete copy[row.barcode_id];
        return copy;
      });
      fetchBarcodeList(selectedDate);
    } else if (response.status === 400) {
      const fieldErrors = response.data;
      const firstErrorMsg =
        fieldErrors && typeof fieldErrors === 'object'
          ? Object.values(fieldErrors)[0]?.[0]
          : null;
      setIsError(true);
      setMessage(firstErrorMsg || response.error);
    } else {
      setIsError(true);
      setMessage(response.error);
    }
    setUpdatingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const response = await apiRequest(
      `${franchiseurl}stockbarcode/`,
      'POST',
      formData
    );

    if (response.success) {
      // Backend success response, e.g. { message: 'Barcode stock saved successfully' }
      setIsError(false);
      setMessage(response.data?.message || 'Saved successfully');
      setFormData({ startbarcode: '', endbarcode: '' });
      if (selectedDate === todayStr) {
        fetchBarcodeList(selectedDate);
      }
    } else if (response.status === 400) {
      // response.data here is serializer.errors, e.g. { startbarcode: ['This field is required.'] }
      const fieldErrors = response.data;
      const firstErrorMsg =
        fieldErrors && typeof fieldErrors === 'object'
          ? Object.values(fieldErrors)[0]?.[0]
          : null;
      setIsError(true);
      setMessage(firstErrorMsg || response.error);
    } else {
      // 401, 500, network error, etc. — apiRequest already gives a friendly message
      setIsError(true);
      setMessage(response.error);
    }

    setIsLoading(false);
  };

  return (
    <PageWrapper>
      <AnimatedBackground>
        <FloatingShape delay="0s" />
        <FloatingShape delay="2s" />
        <FloatingShape delay="4s" />
      </AnimatedBackground>

      {message && (
        <Toast $isError={isError}>
          <ToastIcon>{isError ? '⚠️' : '✅'}</ToastIcon>
          <ToastText>{message}</ToastText>
          <ToastClose onClick={() => setMessage('')}>×</ToastClose>
        </Toast>
      )}

      <FormCard>
        <Header>
            <Icon>🔖</Icon>
            <div>
              <Title>Barcode Stock Entry</Title>
              <Subtitle>Enter barcode range to manage stock efficiently</Subtitle>
            </div>
          </Header>

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

        <TableCard>
          <TableHeaderRow>
            <TableTitle>📋 Barcode Stock Details</TableTitle>
            <DatePickerWrap>
              <DateLabel htmlFor="barcodeDate">Date</DateLabel>
              <DateInput
                id="barcodeDate"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </DatePickerWrap>
          </TableHeaderRow>

          {isTableLoading ? (
            <TableStatus>
              <Spinner /> Loading barcode details...
            </TableStatus>
          ) : barcodeList.length === 0 ? (
            <TableStatus>No barcode stock entries found for this date.</TableStatus>
          ) : (
            <TableScroll>
              <StyledTable>
                <thead>
                  <tr>
                    <Th>Barcode ID</Th>
                    <Th>Start Barcode</Th>
                    <Th>End Barcode</Th>
                    <Th>Created By</Th>
                    <Th>Created Date</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {barcodeList.map((row) => (
                    <tr key={row.barcode_id}>
                      <Td>{row.barcode_id}</Td>
                      <Td>
                        <EditInput
                          type="text"
                          value={getFieldValue(row, 'startbarcode')}
                          onChange={(e) =>
                            handleEditChange(row.barcode_id, 'startbarcode', e.target.value)
                          }
                        />
                      </Td>
                      <Td>
                        <EditInput
                          type="text"
                          value={getFieldValue(row, 'endbarcode')}
                          onChange={(e) =>
                            handleEditChange(row.barcode_id, 'endbarcode', e.target.value)
                          }
                        />
                      </Td>
                      <Td>{row.createdby}</Td>
                      <Td>
                        {row.createddate
                          ? new Date(row.createddate).toLocaleString()
                          : '-'}
                      </Td>
                      <Td>
                        <UpdateButton
                          type="button"
                          disabled={updatingId === row.barcode_id}
                          onClick={() => handleUpdateRow(row)}
                        >
                          {updatingId === row.barcode_id ? <Spinner /> : 'Update'}
                        </UpdateButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableScroll>
          )}
        </TableCard>
        </PageWrapper>

  );
};

// ====== STYLED COMPONENTS ======

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 500px;
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

  /* Shrink floating shapes on small screens so they don't overwhelm the layout */
  @media (max-width: 600px) {
    &:nth-child(1) {
      width: 50px;
      height: 50px;
    }
    &:nth-child(2) {
      width: 70px;
      height: 70px;
    }
    &:nth-child(3) {
      width: 55px;
      height: 55px;
    }
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
  max-width: 1400px;
  width: 100%;
  min-width: 0;
  padding: 1.75rem 2rem;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  box-sizing: border-box;
  
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

  @media (max-width: 900px) {
    padding: 1.6rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 22px;
  }
  
  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    border-radius: 20px;
    max-height: none;
    width: calc(100% - 0px);
  }

  @media (max-width: 480px) {
    padding: 1.1rem 0.9rem;
    border-radius: 18px;
  }

  @media (max-width: 400px) {
    padding: 1rem 0.75rem;
    border-radius: 16px;
  }

  @media (max-width: 340px) {
    padding: 0.85rem 0.6rem;
    border-radius: 14px;
  }
`;

const Header = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    gap: 0.6rem;
    margin-bottom: 1.1rem;
  }

  @media (max-width: 340px) {
    gap: 0.5rem;
    margin-bottom: 0.9rem;
  }
`;

const Icon = styled.div`
  font-size: 2.2rem;
  line-height: 1;
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }

  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;  /* Slightly smaller */
  font-weight: bold;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0 0 0.3rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }

  @media (max-width: 400px) {
    font-size: 1.2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;  /* Slightly smaller */
  opacity: 0.9;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }

  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 360px;
  color: ${props => (props.$isError ? '#ffb3b3' : '#26cccc')};
  font-weight: 500;
  background: ${props => (props.$isError ? 'rgba(120, 30, 30, 0.85)' : 'rgba(0, 77, 77, 0.85)')};
  border: 1px solid ${props => (props.$isError ? 'rgba(255, 80, 80, 0.4)' : 'rgba(38, 204, 204, 0.4)')};
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  animation: ${slideIn} 0.35s ease-out;

  @media (max-width: 480px) {
    left: 16px;
    right: 16px;
    top: 16px;
    max-width: none;
  }
`;

const ToastIcon = styled.span`
  font-size: 1.1rem;
  line-height: 1;
`;

const ToastText = styled.span`
  flex: 1;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0 0 0.4rem;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.2rem;

  @media (max-width: 900px) {
    gap: 1rem;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  @media (max-width: 340px) {
    gap: 0.75rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1 1 220px;
  min-width: 180px;

  @media (max-width: 900px) {
    flex: 1 1 160px;
    min-width: 140px;
  }

  @media (max-width: 640px) {
    flex: 0 0 auto;
    min-width: 0;
    width: 100%;
  }
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
  width: 100%;
  box-sizing: border-box;
  
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

  /* iOS zooms in on inputs with font-size below 16px on focus; keep at 16px on very small screens */
  @media (max-width: 400px) {
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  background: ${colors.gradients.accent};
  color: #fff;
  padding: 0.9rem 1.4rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);

  @media (max-width: 640px) {
    width: 100%;
  }
  
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

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  max-width: 1400px;
  width: 100%;
  padding: 1.75rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

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

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 1.25rem;
  }

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    border-radius: 20px;
  }

  @media (max-width: 400px) {
    padding: 1rem 0.75rem;
    border-radius: 16px;
  }
`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const TableTitle = styled.h3`
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 0;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const DatePickerWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const DateLabel = styled.label`
  font-weight: 600;
  color: ${colors.primary.lightTeal};
  font-size: 0.9rem;
`;

const DateInput = styled.input`
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  color-scheme: dark;

  &:focus {
    border-color: ${colors.primary.brightTeal};
    box-shadow: 0 0 0 3px rgba(38, 204, 204, 0.3);
  }

  @media (max-width: 480px) {
    flex: 1;
    min-width: 0;
  }
`;

const TableStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.85);
  padding: 2rem 0;
  font-size: 0.95rem;
  text-align: center;

  @media (max-width: 480px) {
    padding: 1.5rem 0;
    font-size: 0.85rem;
  }
`;

const TableScroll = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Keep the horizontal scrollbar visible/usable so it's clear the
     table can be scrolled sideways on narrow screens */
  scrollbar-width: thin;
  scrollbar-color: rgba(38, 204, 204, 0.5) rgba(255, 255, 255, 0.08);

  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(38, 204, 204, 0.5);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(38, 204, 204, 0.75);
  }

  @media (max-width: 600px) {
    overflow-x: scroll;
    border-radius: 12px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;

  /* On small screens the table stays horizontally scrollable within
     TableScroll rather than squeezing columns unreadably small */
  @media (max-width: 600px) {
    min-width: 560px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 0.7rem 0.8rem;
  color: ${colors.primary.lightTeal};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: #1a4d4d;
  z-index: 1;

  @media (max-width: 600px) {
    padding: 0.55rem 0.6rem;
    font-size: 0.75rem;
  }
`;

const Td = styled.td`
  padding: 0.6rem 0.8rem;
  color: #fff;
  font-size: 0.92rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;

  @media (max-width: 600px) {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }
`;

const EditInput = styled.input`
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  width: 120px;

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${colors.primary.brightTeal};
    box-shadow: 0 0 0 3px rgba(38, 204, 204, 0.3);
  }

  @media (max-width: 600px) {
    width: 100px;
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
`;

const UpdateButton = styled.button`
  background: ${colors.gradients.accent};
  color: #fff;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${colors.gradients.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
  }
`;

export default Barcodestock;