// src/components/EmployeeList.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import GradientText from './GradientText';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { 
  GlobalStyle, 
  PrimaryButton, 
  SecondaryButton, 
  AccentButton, 
  Container as GlobalContainer, 
  GradientCard, 
  LiquidBackground,
  colors 
} from './GlobalStyle';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% { 
    transform: translate(0, 0) rotate(0deg); 
  }
  33% { 
    transform: translate(30px, -30px) rotate(120deg); 
  }
  66% { 
    transform: translate(-20px, 20px) rotate(240deg); 
  }
`;

// Updated Container using LiquidBackground
const Container = styled(LiquidBackground)`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
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

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem 0;
`;

// Updated ListContainer with enhanced glassmorphism
const ListContainer = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
    border-radius: 20px;
  }
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
`;

const DirectoryHeader = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const SearchInput = styled.input`
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #ffffff;
  width: 100%;
  max-width: 400px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.brightTeal};
    box-shadow: 0 0 0 3px rgba(38, 204, 204, 0.3);
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const EmployeeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  padding: 1.7rem 1.1rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.8s ease-in;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${colors.gradients.accent};
    border-radius: 18px 18px 0 0;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 36px rgba(38, 204, 204, 0.25);
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(38, 204, 204, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EmployeeName = styled.h4`
  color: #ffffff;
  font-weight: 600;
  font-size: 1.3rem;
  margin: 0;
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FranchiseId = styled.span`
  background: rgba(38, 204, 204, 0.2);
  color: ${colors.primary.lightTeal};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(38, 204, 204, 0.3);
`;

const PhotoSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FranchisePhoto = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(38, 204, 204, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
    border-color: ${colors.primary.brightTeal};
    box-shadow: 0 0 20px rgba(38, 204, 204, 0.5);
  }
`;

const PhotoPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  text-align: center;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  color: ${colors.primary.lightTeal};
  font-size: 0.88rem;
  font-weight: 500;
  margin-bottom: 2px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const InfoValue = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
`;

const FilesSection = styled.div`
  margin: 0.6rem 0 1rem;
  padding: 0.93rem 1rem 0.73rem;
  background: rgba(255, 255, 255, 0.058);
  border-radius: 12px;
  border: 1px solid rgba(38, 204, 204, 0.1);
`;

const FilesSectionTitle = styled.h6`
  color: ${colors.primary.lightTeal};
  font-size: 0.92rem;
  font-weight: 600;
  margin-bottom: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FileIconsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FileIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.65rem;
  border-radius: 8px;
  background: rgba(38, 204, 204, 0.09);
  border: 1px solid rgba(38, 204, 204, 0.27);
  min-width: 60px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(38, 204, 204, 0.2);
    border-color: rgba(38, 204, 204, 0.5);
    transform: translateY(-2px);
  }
  
  &.available {
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(16, 185, 129, 0.1);
  }
  
  &.unavailable {
    opacity: 0.49;
    cursor: not-allowed;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.19);
  }
`;

const FileIconSymbol = styled.div`
  font-size: 1.35rem;
  margin-bottom: 0.1rem;
`;

const FileIconLabel = styled.span`
  font-size: 0.77rem;
  color: ${colors.primary.lightTeal};
  text-align: center;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(38, 204, 204, 0.17);
`;

// Toggle Switch Components
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToggleWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 56px;
  height: 30px;
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : 'linear-gradient(135deg, #6b7280, #4b5563)'
  };
  border-radius: 30px;
  cursor: pointer;
  border: 2px solid ${props => props.isActive 
    ? 'rgba(16, 185, 129, 0.13)' 
    : 'rgba(107, 114, 128, 0.19)'
  };
  box-shadow: ${props => props.isActive
    ? '0 0 15px rgba(16, 185, 129, 0.4)'
    : '0 1.5px 5px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.04);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ToggleKnob = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isActive ? '28px' : '2px'};
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #fff, #f8fafc);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

const ToggleLabel = styled.span`
  color: ${props => props.isActive ? '#10b981' : '#97a5aa'};
  font-size: 0.825rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const ActionButton = styled(SecondaryButton)`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
`;

// Stats Section
const StatsSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.7rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: 0.15s;
  animation-fill-mode: both;
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.1rem 2.1rem;
  text-align: center;
  flex: 1;
  min-width: 170px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatNumber = styled.div`
  color: #fff;
  font-weight: 700;
  font-size: 1.3rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.93rem;
  font-weight: 500;
  margin-top: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Loading and Error States
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ffffff;
  font-size: 1.1rem;
  
  &::before {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid ${colors.primary.brightTeal};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.13rem;
  text-align: center;
  
  &::before {
    content: '📄';
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.37;
  }
`;

// Modal Components
const Modal = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: scale(1.1);
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  border-radius: 12px;
  object-fit: contain;
`;

// Main Component
const EmployeeList = () => {
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  // Enhanced API request function with better error handling
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
      } else if (response.status === 404) {
        return { success: false, error: 'Requested resource not found.', status: 404, data: response.data };
      } else {
        return { success: false, error: 'Something went wrong. Try again.', status: response.status, data: response.data };
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
    }
  };

  const handleViewDetails = (franchiseId) => {
    navigate(`/EmployeeDetails/${franchiseId}`);
  };

  useEffect(() => {
    fetchEmployees();
  }, [franchiseurl]);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      const response = await apiRequest(`${franchiseurl}get-franchise/`);
      if (response.success) {
        setEmployees(response.data || []);
        calculateStats(response.data || []);
      } else {
        console.error('Error fetching employees:', response.error);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter(emp => emp.is_active || emp.status === 'Active').length;
    const inactive = total - active;
    setStats({ total, active, inactive });
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = employees.filter(employee =>
      (employee.franchise_name || "").toLowerCase().includes(term) ||
      (employee.franchise_id || "").toLowerCase().includes(term) ||
      (employee.location_id || "").toLowerCase().includes(term) ||
      (employee.email || "").toLowerCase().includes(term) ||
      (employee.contact_no || "").includes(term)
    );
    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleStatusToggle = async (franchiseId) => {
    try {
      const response = await apiRequest(`${franchiseurl}toggle-franchise-status/${franchiseId}/`, 'PATCH');
      if (response.success) {
        const updatedEmployee = response.data.employee;
        const updatedEmployees = employees.map(emp =>
          emp.franchise_id === updatedEmployee.franchise_id ? updatedEmployee : emp
        );
        setEmployees(updatedEmployees);
        calculateStats(updatedEmployees);
      } else {
        console.error('Error toggling status:', response.error);
        fetchEmployees(); // fallback
      }
    } catch (error) {
      console.error('Error toggling employee status:', error);
      fetchEmployees();
    }
  };

  const getEmployeeStatus = (employee) => (employee.is_active ? "Active" : "Not Active");

  // Enhanced file handling with API request
  const getFileUrl = async (fileId) => {
    if (!fileId) return null;
    
    try {
      const response = await apiRequest(`${franchiseurl}get-file/${fileId}/`);
      if (response.success) {
        return response.data.file_url || `${franchiseurl}get-file/${fileId}/`;
      } else {
        console.error('Error fetching file URL:', response.error);
        return `${franchiseurl}get-file/${fileId}/`;
      }
    } catch (error) {
      console.error('Error fetching file URL:', error);
      return `${franchiseurl}get-file/${fileId}/`;
    }
  };

  const openModal = async (fileId, type) => {
    if (!fileId) return;
    
    const fileUrl = await getFileUrl(fileId);
    
    if (type === "image") {
      setModalContent(<ModalImage src={fileUrl} alt="Franchise Photo" />);
      setModalShow(true);
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  const closeModal = () => {
    setModalShow(false);
    setModalContent(null);
  };

  const renderFileIcons = (employee) => {
    const files = [
      { id: employee.aadhaar_file_id, label: "Aadhaar", icon: "🆔", type: "document" },
      { id: employee.payment_file_id, label: "Payment", icon: "💳", type: "document" },
      { id: employee.agreement_file_id, label: "Agreement", icon: "📄", type: "document" },
    ];

    return files.map((file, idx) => (
      <FileIcon
        key={idx}
        className={file.id ? "available" : "unavailable"}
        onClick={() => file.id && openModal(file.id, file.type)}
        title={file.id ? `Click to view ${file.label}` : `${file.label} not available`}
      >
        <FileIconSymbol>{file.icon}</FileIconSymbol>
        <FileIconLabel>{file.label}</FileIconLabel>
      </FileIcon>
    ));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <AnimatedBackground>
          <FloatingShape delay="0s" />
          <FloatingShape delay="2s" />
          <FloatingShape delay="4s" />
        </AnimatedBackground>
        
        <ContentWrapper>
          <GlobalContainer>
            <ListContainer>
              <DirectoryHeader>
                <GradientText
                  colors={["#004d4d", "#008080", "#26cccc", "#48d1cc", "#7fdfdf", "#26cccc", "#008080"]}
                  animationSpeed={4}
                  showBorder={false}
                  className="custom-class"
                >
                  Employee Directory
                </GradientText>
              </DirectoryHeader>

              <StatsSection>
                <StatCard>
                  <StatNumber>{stats.total}</StatNumber>
                  <StatLabel>Total Employees</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{stats.active}</StatNumber>
                  <StatLabel>Active</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{stats.inactive}</StatNumber>
                  <StatLabel>Inactive</StatLabel>
                </StatCard>
              </StatsSection>

              <SearchSection>
                <div className="row">
                  <div className="col-md-6">
                    <SearchInput
                      type="text"
                      placeholder="Search by name, ID, location, email, or phone..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </SearchSection>

              {loading ? (
                <LoadingSpinner>Loading employees...</LoadingSpinner>
              ) : filteredEmployees.length === 0 ? (
                <NoDataMessage>
                  {searchTerm ? "No employees found matching your search" : "No employees registered yet"}
                </NoDataMessage>
              ) : (
                <EmployeeGrid>
                  {filteredEmployees.map((employee, idx) => (
                    <EmployeeCard key={employee.id || idx}>
                      <CardHeader>
                        <EmployeeName>
                          {employee.franchise_name || "Unknown Name"}
                        </EmployeeName>
                        <FranchiseId>
                          ID: {employee.franchise_id || "N/A"}
                        </FranchiseId>
                      </CardHeader>

                      <PhotoSection>
                        {employee.franchise_photo_file_id ? (
                          <FranchisePhoto
                            src={`${franchiseurl}get-file/${employee.franchise_photo_file_id}/`}
                            alt="Franchise Photo"
                            onClick={() => openModal(employee.franchise_photo_file_id, "image")}
                            title="Click to view full image"
                          />
                        ) : (
                          <PhotoPlaceholder>No Photo</PhotoPlaceholder>
                        )}
                      </PhotoSection>

                      <CardBody>
                        <InfoItem>
                          <InfoLabel>Location</InfoLabel>
                          <InfoValue>{employee.location_id || "N/A"}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Contact</InfoLabel>
                          <InfoValue>{employee.contact_no || "N/A"}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Email</InfoLabel>
                          <InfoValue>{employee.email || "N/A"}</InfoValue>
                        </InfoItem>
                      </CardBody>

                      <FilesSection>
                        <FilesSectionTitle>Documents</FilesSectionTitle>
                        <FileIconsContainer>
                          {renderFileIcons(employee)}
                        </FileIconsContainer>
                      </FilesSection>

                      <CardFooter>
                        <ToggleContainer>
                          <ToggleWrapper>
                            <ToggleSwitch
                              isActive={getEmployeeStatus(employee) === "Active"}
                              onClick={() => handleStatusToggle(employee.franchise_id)}
                            >
                              <ToggleKnob isActive={getEmployeeStatus(employee) === "Active"} />
                            </ToggleSwitch>
                          </ToggleWrapper>
                          <ToggleLabel isActive={getEmployeeStatus(employee) === "Active"}>
                            {getEmployeeStatus(employee)}
                          </ToggleLabel>
                        </ToggleContainer>
                        <ActionButton onClick={() => handleViewDetails(employee.franchise_id)}>
                          View Details
                        </ActionButton>
                      </CardFooter>
                    </EmployeeCard>
                  ))}
                </EmployeeGrid>
              )}
            </ListContainer>
          </GlobalContainer>
        </ContentWrapper>

        {/* Modal for displaying images and files */}
        <Modal show={modalShow} onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>
            {modalContent}
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default EmployeeList;