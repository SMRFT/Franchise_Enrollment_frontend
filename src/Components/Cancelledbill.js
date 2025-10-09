import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #006666 0%, #00a0a0 50%, #26cccc 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-top: 0.5rem;
  font-weight: 300;
`;

const TestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const TestCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

const PatientId = styled.h3`
  color: #006666;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const TestsSection = styled.div`
  margin-top: 1.5rem;
`;

const TestsSectionTitle = styled.h4`
  color: #006666;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TestItem = styled.div`
  background: linear-gradient(90deg, rgba(0, 102, 102, 0.1) 0%, rgba(38, 204, 204, 0.1) 100%);
  border-left: 4px solid #00a0a0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(90deg, rgba(0, 102, 102, 0.15) 0%, rgba(38, 204, 204, 0.15) 100%);
    transform: translateX(5px);
  }
`;

const TestName = styled.span`
  font-weight: 600;
  color: #006666;
  display: block;
  margin-bottom: 0.25rem;
`;

const TestDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TestStatus = styled.span`
  background: ${props => 
    props.status === 'Cancel Accepted' ? '#ff4757' : 
    props.status === 'Cancel Requested' ? '#ffa502' : 
    props.status === 'cancelled' ? '#ff4757' : 
    props.status === 'pending' ? '#ffa502' : '#26cccc'
  };
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TestMRP = styled.span`
  font-weight: 600;
  color: #006666;
  background: rgba(0, 102, 102, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'approve' ? `
    background: #27ae60;
    color: white;
    
    &:hover {
      background: #229954;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #95a5a6;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #95a5a6;
      cursor: not-allowed;
      transform: none;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: #00a0a0;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CancelRequestedTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingTests, setProcessingTests] = useState(new Set());
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

  useEffect(() => {
    fetchTests();
  }, [franchiseurl]);

  const fetchTests = () => {
    setLoading(true);
    axios
      .get(`${franchiseurl}cancel-requested/`)
      .then((res) => {
        setTests(res.data.cancel_requested || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cancel requested tests:", err);
        setLoading(false);
      });
  };

  const handleTestAction = async (patientId, barcode, testName, action) => {
    const testKey = `${patientId}_${barcode}_${testName}`;
    setProcessingTests(prev => new Set([...prev, testKey]));

    try {
      const response = await axios.post(`${franchiseurl}update-test-status/`, {
        patient_id: patientId,
        barcode: barcode,
        test_name: testName,
        new_status: action === 'approve' ? 'Cancel Accepted' : 'Rejected'
      });

      if (response.status === 200) {
        // Refresh the tests data
        fetchTests();
        
        // Show success message (you can replace with a proper toast notification)
        alert(`Test ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      }
    } catch (error) {
      console.error(`Error ${action}ing test:`, error);
      alert(`Error ${action}ing test. Please try again.`);
    } finally {
      setProcessingTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(testKey);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Cancel Requested Tests</Title>
        <Subtitle>Manage and review test cancellation requests</Subtitle>
      </Header>

      {tests.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <EmptyStateText>No cancel requested tests found.</EmptyStateText>
        </EmptyState>
      ) : (
        <TestsGrid>
          {tests.map((item, idx) => (
            <TestCard key={idx}>
              <CardHeader>
                <PatientId>Patient ID: {item.patient_id}</PatientId>
              </CardHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Barcode</InfoLabel>
                  <InfoValue>{item.barcode}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Franchise</InfoLabel>
                  <InfoValue>{item.franchise_id}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Referred Doctor</InfoLabel>
                  <InfoValue>{item.referredDoctor}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Total Tests</InfoLabel>
                  <InfoValue>{item.cancel_requested_tests?.length || 0}</InfoValue>
                </InfoItem>
              </InfoGrid>

              <TestsSection>
                <TestsSectionTitle>
                  📋 Requested Cancellations
                </TestsSectionTitle>
                <TestsList>
                  {item.cancel_requested_tests?.map((test, i) => {
                    const testKey = `${item.patient_id}_${item.barcode}_${test.test_name}`;
                    const isProcessing = processingTests.has(testKey);
                    const showActions = test.status === 'Cancel Requested';
                    
                    return (
                      <TestItem key={i}>
                        <TestName>{test.test_name}</TestName>
                        <TestDetails>
                          <TestInfo>
                            <TestStatus status={test.status}>{test.status}</TestStatus>
                            <TestMRP>₹{test.MRP}</TestMRP>
                          </TestInfo>
                          {showActions && (
                            <ActionButtons>
                              <ActionButton
                                variant="approve"
                                disabled={isProcessing}
                                onClick={() => handleTestAction(item.patient_id, item.barcode, test.test_name, 'approve')}
                              >
                                {isProcessing ? '...' : 'Approve'}
                              </ActionButton>
                              <ActionButton
                                variant="reject"
                                disabled={isProcessing}
                                onClick={() => handleTestAction(item.patient_id, item.barcode, test.test_name, 'reject')}
                              >
                                {isProcessing ? '...' : 'Reject'}
                              </ActionButton>
                            </ActionButtons>
                          )}
                        </TestDetails>
                      </TestItem>
                    );
                  })}
                </TestsList>
              </TestsSection>
            </TestCard>
          ))}
        </TestsGrid>
      )}
    </Container>
  );
};

export default CancelRequestedTests;