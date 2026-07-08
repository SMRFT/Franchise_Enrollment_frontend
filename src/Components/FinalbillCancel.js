"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import axios from "axios"
import styled from "styled-components"

// ================= Enhanced Styled Components =================
const Container = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #006666 0%, #00a0a0 50%, #26cccc 100%);
  min-height: 100vh;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  p {
    color: rgba(255,255,255,0.9);
    font-size: 1.1rem;
    margin: 0;
  }
`

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`

const StatCard = styled.div`
  background: rgba(255,255,255,0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  text-align: center;
  min-width: 120px;
  backdrop-filter: blur(10px);
  
  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #006666;
    display: block;
  }
  
  .label {
    color: #004d4d;
    font-size: 0.9rem;
    margin-top: 5px;
  }
`

const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.97);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
`

const TableScroll = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`

const Thead = styled.thead`
  background: linear-gradient(90deg, #006666 0%, #00a0a0 100%);
`

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.25rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:hover {
    background: rgba(38, 204, 204, 0.08);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eef1f1;
  }
`

const Td = styled.td`
  padding: 0.9rem 1.25rem;
  font-size: 0.92rem;
  color: #333;
  vertical-align: middle;
`

const TestNameCell = styled(Td)`
  font-weight: 600;
  color: #006666;
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: ${props => {
    switch (props.status) {
      case 'Cancel Requested': return '#f39c12';
      case 'Cancel Accepted': return '#3498db';
      case 'Cancel Approved': return '#27ae60';
      case 'Reject': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
`

const MRPTag = styled.span`
  font-weight: 700;
  color: #006666;
  background: rgba(0, 102, 102, 0.08);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
`

const DateInfo = styled.div`
  font-size: 0.78rem;
  color: #666;
  margin-top: 0.35rem;
  white-space: nowrap;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  &.view {
    background: #006666;
    color: white;

    &:hover {
      background: #004d4d;
      transform: translateY(-1px);
    }
  }

  &.approve {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #219a52, #27ae60);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
    }
  }
  
  &.reject {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #c0392b, #a93226);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const NoActionLabel = styled.span`
  color: #aaa;
  font-size: 0.8rem;
  font-style: italic;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255,255,255,0.8);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .message {
    font-size: 1.2rem;
    font-weight: 500;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 20, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
`

const ModalCard = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #006666 0%, #00a0a0 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const ModalHeaderText = styled.div`
  color: white;
`

const ModalPatientId = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`

const ModalSubline = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.25rem;
`

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
`

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`

const ModalTotalLine = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;

  strong {
    color: #006666;
  }
`

const ModalTestList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const ModalTestItem = styled.li`
  font-size: 0.92rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`

const ModalTestName = styled.span`
  font-weight: 600;
  color: #006666;
`

// ================= Enhanced Component =================
const FinalApprovalcancaltest = () => {
  const [cancelAccepted, setCancelAccepted] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingActions, setProcessingActions] = useState(new Set())
  const [viewPatient, setViewPatient] = useState(null)
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    axios
      .get(`${franchiseurl}cancel-requested/`)
      .then((res) => {
        console.log('API Response:', res.data) // Debug log
        if (res.data && res.data.cancel_requested) {
          // FIXED: Show all cancel requested tests, not just "Cancel Accepted"
          const filtered = res.data.cancel_requested
            .map((item) => ({
              ...item,
              cancel_requested_tests: item.cancel_requested_tests.filter((test) => 
                test.status === "Cancel Requested" || test.status === "Cancel Accepted"
              ),
            }))
            .filter((item) => item.cancel_requested_tests.length > 0)

          setCancelAccepted(filtered)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('API Error:', err)
        setLoading(false)
      })
  }

  const handleAction = (patientId, testId, action) => {
    const actionKey = `${patientId}-${testId}`
    setProcessingActions(prev => new Set([...prev, actionKey]))
    
    axios
      .post(`${franchiseurl}update_cancel_status/`, {
        patient_id: patientId,
        test_id: testId,
        action: action,
      })
      .then((res) => {
        if (res.data.success) {
          setCancelAccepted((prev) =>
            prev.map((p) =>
              p.patient_id === patientId
                ? {
                    ...p,
                    cancel_requested_tests: p.cancel_requested_tests.map((t) =>
                      t.test_id === testId
                        ? {
                            ...t,
                            status: action === "approve" ? "Cancel Approved" : "Reject",
                            cancel_approved_date:
                              action === "approve" ? new Date().toISOString() : t.cancel_approved_date,
                            rejected_date: action === "reject" ? new Date().toISOString() : t.rejected_date,
                          }
                        : t,
                    ),
                  }
                : p,
            ),
          )
        }
        setProcessingActions(prev => {
          const newSet = new Set(prev)
          newSet.delete(actionKey)
          return newSet
        })
      })
      .catch((err) => {
        console.error(err)
        setProcessingActions(prev => {
          const newSet = new Set(prev)
          newSet.delete(actionKey)
          return newSet
        })
      })
  }

  // Calculate statistics
  const totalPatients = cancelAccepted.length
  const totalTests = cancelAccepted.reduce((sum, patient) => sum + patient.cancel_requested_tests.length, 0)
  const approvedTests = cancelAccepted.reduce((sum, patient) => 
    sum + patient.cancel_requested_tests.filter(test => test.status === "Cancel Approved").length, 0
  )
  const pendingTests = cancelAccepted.reduce((sum, patient) => 
    sum + patient.cancel_requested_tests.filter(test => test.status === "Cancel Requested").length, 0
  )

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <h1>Final Approval Dashboard</h1>
        <p>Review and approve test cancellation requests</p>
      </Header>

      <StatsBar>
        <StatCard>
          <span className="number">{totalPatients}</span>
          <div className="label">Patients</div>
        </StatCard>
        <StatCard>
          <span className="number">{totalTests}</span>
          <div className="label">Total Tests</div>
        </StatCard>
        <StatCard>
          <span className="number">{pendingTests}</span>
          <div className="label">Pending</div>
        </StatCard>
        <StatCard>
          <span className="number">{approvedTests}</span>
          <div className="label">Approved</div>
        </StatCard>
      </StatsBar>

      {cancelAccepted.length === 0 ? (
        <EmptyState>
          <div className="icon">📋</div>
          <div className="message">No cancellation requests found</div>
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
                  <Th>Test Name</Th>
                  <Th>Status</Th>
                  <Th>MRP</Th>
                  <Th>Actions</Th>
                </tr>
              </Thead>
              <tbody>
                {cancelAccepted.map((patient, idx) =>
                  patient.cancel_requested_tests.map((test, tIdx) => {
                    const actionKey = `${patient.patient_id}-${test.test_id}`
                    const isProcessing = processingActions.has(actionKey)
                    const showActions = test.status === "Cancel Requested" || test.status === "Cancel Accepted"

                    return (
                      <Tr key={`${idx}_${tIdx}`}>
                        <Td>{patient.patient_id}</Td>
                        <Td>{patient.barcode}</Td>
                        <Td>{patient.franchise_id}</Td>
                        <Td>{patient.referredDoctor}</Td>
                        <TestNameCell>{test.test_name}</TestNameCell>
                        <Td>
                          <StatusBadge status={test.status}>{test.status}</StatusBadge>
                          {test.cancel_approved_date && (
                            <DateInfo>✅ {new Date(test.cancel_approved_date).toLocaleDateString()}</DateInfo>
                          )}
                          {test.rejected_date && (
                            <DateInfo>❌ {new Date(test.rejected_date).toLocaleDateString()}</DateInfo>
                          )}
                        </Td>
                        <Td>
                          <MRPTag>₹{test.MRP}</MRPTag>
                        </Td>
                        <Td>
                          <ActionButtons>
                            <ActionButton
                              className="view"
                              onClick={() => setViewPatient(patient)}
                            >
                              View
                            </ActionButton>
                            {showActions ? (
                              <>
                                <ActionButton
                                  className="approve"
                                  onClick={() => handleAction(patient.patient_id, test.test_id, "approve")}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Approve"}
                                </ActionButton>
                                <ActionButton
                                  className="reject"
                                  onClick={() => handleAction(patient.patient_id, test.test_id, "reject")}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Reject"}
                                </ActionButton>
                              </>
                            ) : (
                              <NoActionLabel>—</NoActionLabel>
                            )}
                          </ActionButtons>
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </tbody>
            </Table>
          </TableScroll>
        </TableWrapper>
      )}

      {viewPatient &&
        createPortal(
          <ModalOverlay onClick={() => setViewPatient(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalHeaderText>
                  <ModalPatientId>Patient ID: {viewPatient.patient_id}</ModalPatientId>
                  <ModalSubline>
                    Barcode: {viewPatient.barcode} &nbsp;•&nbsp; Franchise: {viewPatient.franchise_id}
                  </ModalSubline>
                </ModalHeaderText>
                <ModalCloseButton onClick={() => setViewPatient(null)}>✕</ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <ModalTotalLine>
                  Total Tests: <strong>{viewPatient.cancel_requested_tests?.length || 0}</strong>
                </ModalTotalLine>
                <ModalTestList>
                  {viewPatient.cancel_requested_tests?.map((test, i) => (
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
  )
}

export default FinalApprovalcancaltest