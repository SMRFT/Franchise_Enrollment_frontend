import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  margin-bottom: 2.5rem;
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

const TableWrapper = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 960px;
`;

const Thead = styled.thead`
  background: linear-gradient(90deg, #006666 0%, #00a0a0 100%);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.25rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:hover {
    background: rgba(38, 204, 204, 0.08);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eef1f1;
  }
`;

const Td = styled.td`
  padding: 0.9rem 1.25rem;
  font-size: 0.92rem;
  color: #333;
  vertical-align: middle;
`;

const TestNameCell = styled(Td)`
  font-weight: 600;
  color: #006666;
`;

const StatusBadge = styled.span`
  background: ${props =>
    props.status === 'Cancel Accepted' ? '#ff4757' :
    props.status === 'Cancel Requested' ? '#ffa502' :
    props.status === 'cancelled' ? '#ff4757' :
    props.status === 'pending' ? '#ffa502' : '#26cccc'
  };
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const MRPTag = styled.span`
  font-weight: 700;
  color: #006666;
  background: rgba(0, 102, 102, 0.08);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${props => props.$variant === 'approve' ? `
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
  ` : props.$variant === 'view' ? `
    background: #006666;
    color: white;

    &:hover {
      background: #004d4d;
      transform: translateY(-1px);
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

const NoActionLabel = styled.span`
  color: #aaa;
  font-size: 0.8rem;
  font-style: italic;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 20, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #006666 0%, #00a0a0 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalHeaderText = styled.div`
  color: white;
`;

const ModalPatientId = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`;

const ModalSubline = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.25rem;
`;

const ModalCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const ModalTotalLine = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;

  strong {
    color: #006666;
  }
`;

const ModalTestList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ModalTestItem = styled.li`
  font-size: 0.92rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const ModalTestName = styled.span`
  font-weight: 600;
  color: #006666;
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
  const [viewItem, setViewItem] = useState(null);
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
        <TableWrapper>
          <TableScroll>
            <Table>
              <Thead>
                <tr>
                  <Th>Patient ID</Th>
                  <Th>Barcode</Th>
                  <Th>Franchise</Th>
                  <Th>Referred Doctor</Th>
                  {/* <Th>Test Name</Th> */}
                  <Th>Status</Th>
                  <Th>MRP</Th>
                  <Th>Actions</Th>
                </tr>
              </Thead>
              <tbody>
                {tests.map((item, idx) =>
                  item.cancel_requested_tests?.map((test, i) => {
                    const testKey = `${item.patient_id}_${item.barcode}_${test.test_name}`;
                    const isProcessing = processingTests.has(testKey);
                    const showActions = test.status === 'Cancel Requested';

                    return (
                      <Tr key={`${idx}_${i}`}>
                        <Td>{item.patient_id}</Td>
                        <Td>{item.barcode}</Td>
                        <Td>{item.franchise_id}</Td>
                        <Td>{item.referredDoctor}</Td>
                        {/* <TestNameCell>{test.test_name}</TestNameCell> */}
                        <Td>
                          <StatusBadge status={test.status}>{test.status}</StatusBadge>
                        </Td>
                        <Td>
                          <MRPTag>₹{test.MRP}</MRPTag>
                        </Td>
                        <Td>
                          <ActionButtons>
                            <ActionButton
                              $variant="view"
                              onClick={() => setViewItem(item)}
                            >
                              View
                            </ActionButton>
                            {showActions ? (
                              <>
                                <ActionButton
                                  $variant="approve"
                                  disabled={isProcessing}
                                  onClick={() => handleTestAction(item.patient_id, item.barcode, test.test_name, 'approve')}
                                >
                                  {isProcessing ? '...' : 'Approve'}
                                </ActionButton>
                                <ActionButton
                                  $variant="reject"
                                  disabled={isProcessing}
                                  onClick={() => handleTestAction(item.patient_id, item.barcode, test.test_name, 'reject')}
                                >
                                  {isProcessing ? '...' : 'Reject'}
                                </ActionButton>
                              </>
                            ) : (
                              <NoActionLabel>—</NoActionLabel>
                            )}
                          </ActionButtons>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </TableScroll>
        </TableWrapper>
      )}

      {viewItem &&
        createPortal(
          <ModalOverlay onClick={() => setViewItem(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalHeaderText>
                  <ModalPatientId>Patient ID: {viewItem.patient_id}</ModalPatientId>
                  <ModalSubline>
                    Barcode: {viewItem.barcode} &nbsp;•&nbsp; Franchise: {viewItem.franchise_id}
                  </ModalSubline>
                </ModalHeaderText>
                <ModalCloseButton onClick={() => setViewItem(null)}>✕</ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <ModalTotalLine>
                  Total Tests: <strong>{viewItem.cancel_requested_tests?.length || 0}</strong>
                </ModalTotalLine>
                <ModalTestList>
                  {viewItem.cancel_requested_tests?.map((test, i) => (
                    <ModalTestItem key={i}>
                      <ModalTestName>{test.test_name}</ModalTestName>
                      <StatusBadge status={test.status}>{test.status}</StatusBadge>
                    </ModalTestItem>
                  ))}
                </ModalTestList>
              </ModalBody>
            </ModalCard>
          </ModalOverlay>,
          document.body
        )}
    </Container>
  );
};

export default CancelRequestedTests;