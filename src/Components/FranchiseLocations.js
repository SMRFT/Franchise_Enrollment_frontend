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
        
        <ModernTableContainer>
          {locations.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🏪</EmptyIcon>
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
                  <TableRow key={location._id}>
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
                        <Toggle>
                          <ToggleSlider
                            active={location.is_active}
                            onClick={() => toggleStatus(location._id, location.is_active)}
                          />
                        </Toggle>
                        <StatusBadge active={location.is_active}>
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
    </LiquidBackground>
  );
};

// Styled Components using Global Style Theme
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

const Toggle = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
`;

const ToggleSlider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.active ? colors.gradients.accent : 'linear-gradient(135deg, #f44336, #d32f2f)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: ${props => props.active ? '32px' : '4px'};
    bottom: 4px;
    background: white;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
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
  ${props => props.active ? `
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
