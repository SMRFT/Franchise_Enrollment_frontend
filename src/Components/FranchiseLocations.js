import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from "axios";
import {
  LiquidBackground,
  GradientCard,
  PrimaryButton,
  Container as GlobalContainer,
  colors
} from './GlobalStyle'; // adjust the path as needed

const FranchiseLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [district, setDistrict] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

  // apiRequest function - copied directly from Dashboard.jsx
  const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      const defaultHeaders = {
        "Content-Type": "application/json",
        "Authorization": token,
      };

      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = data;
      }

      const response = await axios(config);

      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else if (response.status === 400) {
        return { success: false, error: 'Invalid data sent to server.', status: 400, data: response.data };
      } else if (response.status === 401) {
        return { success: false, error: 'Session expired. Please log in again.', status: 401, data: response.data };
      } else {
        return { success: false, error: 'Something went wrong. Try again.', status: response.status, data: response.data };
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${franchiseurl}getlocations/`);

      if (response.success) {
        setLocations(response.data);
      } else {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (response.status === 400) {
          setError('Invalid request. Please check your data.');
        } else if (response.networkError) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(response.error || 'Failed to fetch franchise locations. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!clusterName || !district) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newLocationData = {
        Cluster_Name: clusterName,
        District: district,
        Covered_Areas: `${clusterName}`, // Default or derived string matching backend expectations
        is_active: true
      };

      // API path points to your 'post_loaction/' endpoint setup
      const response = await apiRequest(`${franchiseurl}post_loaction/`, 'POST', newLocationData);

      if (response.success) {
        // Option 1: Append newly created data directly to local state
        setLocations([...locations, response.data]);
        
        // Reset states and close modal
        setClusterName('');
        setDistrict('');
        setIsModalOpen(false);
      } else {
        alert(response.error || 'Failed to save location.');
      }
    } catch (err) {
      console.error('Error posting location:', err);
      alert('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (locationIdRaw, currentStatus) => {
    const locationId = typeof locationIdRaw === 'object' && locationIdRaw.$oid ? locationIdRaw.$oid : locationIdRaw;

    try {
      const response = await apiRequest(
        `${franchiseurl}updatestatus/${locationId}/`,
        'PATCH',
        { is_active: !currentStatus }
      );

      if (response.success) {
        setLocations(locations.map(location => {
          const locId = typeof location._id === 'object' && location._id.$oid ? location._id.$oid : location._id;
          return locId === locationId ? { ...location, is_active: !currentStatus } : location;
        }));
      } else {
        let errorMessage = 'Failed to update status. Please try again.';

        if (response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please check the data.';
        } else if (response.networkError) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (response.error) {
          errorMessage = response.error;
        }

        alert(errorMessage);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('An unexpected error occurred while updating status. Please try again.');
    }
  };

  if (loading) {
    return (
      <LiquidBackground>
        <PageContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading franchise locations...</LoadingText>
          </LoadingContainer>
        </PageContainer>
      </LiquidBackground>
    );
  }

  if (error) {
    return (
      <LiquidBackground>
        <PageContainer>
          <Header>
            <Icon>🏢</Icon>
            <Title>Franchise Locations</Title>
            <Subtitle>Manage and monitor franchise locations across districts</Subtitle>
          </Header>
          <ErrorCard>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>
              <strong>Error:</strong> {error}
            </ErrorText>
            <PrimaryButton onClick={fetchLocations} style={{ marginTop: '1rem' }}>
              🔄 Retry
            </PrimaryButton>
          </ErrorCard>
        </PageContainer>
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground>
      <PageContainer>
        <Header>
          <Icon>🏢</Icon>
          <Title>Franchise Locations</Title>
          <Subtitle>Manage and monitor franchise locations across districts</Subtitle>
        </Header>

        {/* Top Control Bar containing "+ Add Location" link */}
        <TopBarContainer>
          <AddLocationButton onClick={() => setIsModalOpen(true)}>
            ➕ Add Location
          </AddLocationButton>
        </TopBarContainer>

        <ModernTableContainer>
          {locations.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📁</EmptyIcon>
              <EmptyTitle>No franchise locations found</EmptyTitle>
              <EmptyText>There are currently no franchise locations to display.</EmptyText>
              <PrimaryButton onClick={fetchLocations} style={{ marginTop: '1.5rem' }}>
                🔄 Refresh
              </PrimaryButton>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <HeaderRow>
                  <HeaderCell>Location ID</HeaderCell>
                  <HeaderCell>Cluster Name</HeaderCell>
                  <HeaderCell>District</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                </HeaderRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location._id?.$oid || location._id}>
                    <TableCell>
                      <FranchiseId>{location.location_id}</FranchiseId>
                    </TableCell>
                    <TableCell>
                      <ClusterName>{location.Cluster_Name}</ClusterName>
                    </TableCell>
                    <TableCell>
                      <District>{location.District}</District>
                    </TableCell>
                    <TableCell>
                      <StatusContainer>
                        <ToggleWrapper>
                          <ToggleInput
                            type="checkbox"
                            checked={location.is_active}
                            onChange={() => toggleStatus(location._id, location.is_active)}
                          />
                          <ToggleTrack $active={location.is_active}>
                            <ToggleLabel $side="on" $active={location.is_active}>ON</ToggleLabel>
                            <ToggleLabel $side="off" $active={location.is_active}>OFF</ToggleLabel>
                          </ToggleTrack>
                        </ToggleWrapper>
                        <StatusBadge $active={location.is_active}>
                          {location.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </StatusContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModernTableContainer>
      </PageContainer>

      {/* POPUP MODAL POPUP BACKDROP */}
      {isModalOpen && (
        <ModalBackdrop onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Franchise Location</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleAddLocation}>
              <FormGroup>
                <Label>LOCATION ID</Label>
                <DisabledInput 
                  type="text" 
                  placeholder="Auto-generated on save" 
                  disabled 
                />
              </FormGroup>

              <FormGroup>
                <Label>CLUSTER NAME</Label>
                <Input 
                  type="text" 
                  placeholder="e.g. Attayampatti" 
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>DISTRICT</Label>
                <Input 
                  type="text" 
                  placeholder="e.g. Salem" 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </FormGroup>

              <ModalActions>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Location'}
                </SaveButton>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalBackdrop>
      )}
    </LiquidBackground>
  );
};

// --- Styled Components ---

const TopBarContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const AddLocationButton = styled.button`
  background: transparent;
  color: #26cccc;
  border: 2px solid #26cccc;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background: #26cccc;
    color: #0b2b30;
    box-shadow: 0 4px 12px rgba(38, 204, 204, 0.3);
  }
`;

// --- Modal Popup Styles (Matching the dark green/teal glassy UI mockup) ---

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #0f3c3a, #0b2b2a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 480px;
  max-width: 90%;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #26cccc;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
    font-style: italic;
  }
`;

const DisabledInput = styled(Input)`
  background: rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #26cccc, #1b9e9e);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #555555;
    cursor: not-allowed;
  }
`;

// Existing styles below...
const PageContainer = styled(GlobalContainer)`
  padding: 2rem 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 1rem 15px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: ${colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ModernTableContainer = styled(GradientCard)`
  overflow: hidden;
  padding: 0;
  
  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${colors.gradients.secondary};
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th`
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(38, 204, 204, 0.1);
    transform: translateY(-1px);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1rem;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #ffffff;
  
  &:last-child {
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const FranchiseId = styled.span`
  font-weight: 700;
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1rem;
`;

const ClusterName = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 1.05rem;
`;

const District = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 64px;
  height: 32px;
  cursor: pointer;
  margin: 0;

  &:hover > span {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ToggleInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleTrack = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$active ? colors.gradients.accent : 'linear-gradient(135deg, #f44336, #d32f2f)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: ${props => props.$active ? '36px' : '4px'};
    top: 4px;
    background: white;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
`;

const ToggleLabel = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.25s ease;
  ${props => props.$side === 'on' ? 'left: 8px;' : 'right: 7px;'}
  opacity: ${props => (props.$side === 'on' ? (props.$active ? 1 : 0) : (props.$active ? 0 : 1))};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  ${props => props.$active ? `
    background: rgba(38, 204, 204, 0.2);
    color: #26cccc;
    border: 1px solid rgba(38, 204, 204, 0.3);
  ` : `
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.3);
  `}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #26cccc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1.1rem;
`;

const ErrorCard = styled(GradientCard)`
  text-align: center;
  max-width: 500px;
  margin: 2rem auto;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.8);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const EmptyTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const EmptyText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0;
`;

export default FranchiseLocations;