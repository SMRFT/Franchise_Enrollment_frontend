"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import styled from "styled-components"

// ================= Enhanced Styled Components =================
const Container = styled.div`
  max-width: 1200px;
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

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PatientCard = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #006666, #26cccc);
  }
`

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  
  .patient-id {
    font-size: 1.4rem;
    font-weight: 700;
    color: #006666;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .patient-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #006666, #26cccc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 12px 15px;
  border-radius: 10px;
  border-left: 4px solid #006666;
  
  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 500;
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 25px 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #006666;
  
  .icon {
    width: 35px;
    height: 35px;
    background: linear-gradient(135deg, #006666, #26cccc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }
`

const TestCard = styled.div`
  background: linear-gradient(135deg, #006666 0%, #00a0a0 50%, #26cccc 100%);
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100px;
    height: 100px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
  }
`

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  .test-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .test-price {
    background: rgba(255,255,255,0.2);
    padding: 8px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 1.1rem;
  }
`

const StatusBadge = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.status) {
      case 'Cancel Requested': return '#f39c12';
      case 'Cancel Accepted': return '#3498db';
      case 'Cancel Approved': return '#27ae60';
      case 'Reject': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
  margin-bottom: 10px;
`

const DateInfo = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 5px;
  
  .date-icon {
    width: 16px;
    height: 16px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`

const ActionButton = styled.button`
  flex: 1;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
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

// ================= Enhanced Component =================
const FinalApprovalcancaltest = () => {
  const [cancelAccepted, setCancelAccepted] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingActions, setProcessingActions] = useState(new Set())
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
        <PatientGrid>
          {cancelAccepted.map((patient, idx) => (
            <PatientCard key={idx}>
              <PatientHeader>
                <div className="patient-id">
                  <div className="patient-icon">P</div>
                  Patient ID: {patient.patient_id}
                </div>
              </PatientHeader>

              <InfoGrid>
                <InfoItem>
                  <div className="label">Barcode</div>
                  <div className="value">{patient.barcode}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Franchise</div>
                  <div className="value">{patient.franchise_id}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Referred Doctor</div>
                  <div className="value">{patient.referredDoctor}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Total Tests</div>
                  <div className="value">{patient.cancel_requested_tests.length}</div>
                </InfoItem>
              </InfoGrid>

              <SectionTitle>
                <div className="icon">🧪</div>
                Cancellation Requests
              </SectionTitle>

              {patient.cancel_requested_tests.map((test, tIdx) => (
                <TestCard key={tIdx}>
                  <TestHeader>
                    <div>
                      <div className="test-name">{test.test_name}</div>
                      <StatusBadge status={test.status}>{test.status}</StatusBadge>
                    </div>
                    <div className="test-price">₹{test.MRP}</div>
                  </TestHeader>

                  {test.cancel_approved_date && (
                    <DateInfo>
                      <div className="date-icon">✅</div>
                      Approved: {new Date(test.cancel_approved_date).toLocaleDateString()}
                    </DateInfo>
                  )}
                  
                  {test.rejected_date && (
                    <DateInfo>
                      <div className="date-icon">❌</div>
                      Rejected: {new Date(test.rejected_date).toLocaleDateString()}
                    </DateInfo>
                  )}

                  {(test.status === "Cancel Requested" || test.status === "Cancel Accepted") && (
                    <ActionButtons>
                      <ActionButton 
                        className="approve"
                        onClick={() => handleAction(patient.patient_id, test.test_id, "approve")}
                        disabled={processingActions.has(`${patient.patient_id}-${test.test_id}`)}
                      >
                        {processingActions.has(`${patient.patient_id}-${test.test_id}`) ? "Processing..." : "Approve"}
                      </ActionButton>
                      <ActionButton 
                        className="reject"
                        onClick={() => handleAction(patient.patient_id, test.test_id, "reject")}
                        disabled={processingActions.has(`${patient.patient_id}-${test.test_id}`)}
                      >
                        {processingActions.has(`${patient.patient_id}-${test.test_id}`) ? "Processing..." : "Reject"}
                      </ActionButton>
                    </ActionButtons>
                  )}
                </TestCard>
              ))}
            </PatientCard>
          ))}
        </PatientGrid>
      )}
    </Container>
  )
}

export default FinalApprovalcancaltest
