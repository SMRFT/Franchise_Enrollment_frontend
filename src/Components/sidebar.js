import React, { useState } from 'react';
import styled from 'styled-components';

import { 
  UserPlus,        // For Franchise Register
  Store,           // For Franchise List - represents store/business
  MapPin,          // For Franchise Locations
  XCircle,         // For Inactive Franchises - represents inactive/closed
  Barcode,         // For Barcodestock - barcode icon
  FileX,           // For Bill cancel - file with X
  Ban,             // For Bill Cancellation - ban/prohibition symbol
  Menu,            // For mobile toggle
  X,               // For close button
  EllipsisVertical // For collapse button
} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { 
  GlobalStyle, 
  PrimaryButton, 
  SecondaryButton, 
  AccentButton, 
  Container as GlobalContainer, 
  GradientCard, 
  PageBackground,
  colors 
} from './GlobalStyle';

// Main layout container
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  background: ${colors.backgrounds.main};
`;

// Mobile Toggle Button
const MobileToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: ${colors.gradients.primary};
  border: none;
  color: white;
  z-index: 1000;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 77, 77, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.gradients.accent};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 77, 77, 0.4);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

// Overlay for mobile
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 77, 77, 0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  opacity: ${props => (props.isOpen ? '1' : '0')};
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Sidebar Container
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: ${colors.gradients.secondary};
  color: white;
  z-index: 999;
  transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: ${props => (props.isOpen ? '4px 0 20px rgba(13, 51, 51, 0.4)' : 'none')};
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    position: fixed;
    transform: translateX(0);
    width: ${props => (props.isCollapsed ? '80px' : '280px')};
    transition: width 0.3s ease-in-out;
    box-shadow: 4px 0 15px rgba(13, 51, 51, 0.3);
  }
`;

// Main Content Area
const MainContent = styled.main`
  flex: 1;
  min-height: 100vh;
  background: ${colors.backgrounds.page};
  transition: margin-left 0.3s ease-in-out;
  
  @media (min-width: 768px) {
    margin-left: ${props => (props.isCollapsed ? '80px' : '280px')};
  }
  
  @media (max-width: 767px) {
    margin-left: 0;
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  background: linear-gradient(135deg, rgba(13, 38, 38, 0.8) 0%, rgba(26, 64, 64, 0.6) 100%);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  opacity: ${props => (props.isCollapsed ? '0' : '1')};
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  text-shadow: 0 2px 8px rgba(72, 209, 204, 0.4);
  background: ${colors.gradients.accent};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  @media (max-width: 767px) {
    opacity: 1;
    color: white;
    background: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(72, 209, 204, 0.3);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(72, 209, 204, 0.3);
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const SidebarNav = styled.nav`
  padding: 20px 0;
  flex: 1;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin: 2px 8px;
  border-radius: 12px;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 160, 160, 0.2) 0%, rgba(72, 209, 204, 0.3) 100%);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 160, 160, 0.2);
  }

  &.active {
    background: ${colors.gradients.accent};
    box-shadow: 0 6px 20px rgba(32, 178, 170, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: white;
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    }
  }
`;

const NavIcon = styled.div`
  margin-right: ${props => (props.isCollapsed ? '0' : '15px')};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  ${NavItem}:hover & {
    transform: scale(1.15);
  }

  ${NavItem}.active & {
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
  }
`;

const NavText = styled.span`
  opacity: ${props => (props.isCollapsed ? '0' : '1')};
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 767px) {
    opacity: 1;
  }
`;

// Demo content for the main area
const DemoContent = styled.div`
  padding: 40px;
  
  @media (max-width: 767px) {
    padding: 80px 20px 40px 20px; // Extra top padding for mobile toggle button
  }
`;

const SidebarLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('FranchiseRegister');

  const navigate = useNavigate();

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const navItems = [
    { 
      name: 'FranchiseRegister', 
      icon: UserPlus, 
      label: 'Franchise Register' 
    },
    { 
      name: 'FranchiseList', 
      icon: Store,
      label: 'Franchise List' 
    },
    { 
      name: 'FranchiseLocations', 
      icon: MapPin, 
      label: 'Franchise Locations' 
    },
    { 
    name: 'InactiveFranchises', 
    icon: XCircle,      
    label: 'Inactive Franchises' 
     },
    { 
      name: 'Barcodestock', 
      icon: Barcode,
      label: 'Barcodestock' 
    },
        { 
      name: 'Billcancel', 
      icon: FileX,
      label: 'Bill cancel' 
    },
        { 
      name: 'Billcancellation', 
      icon: Ban,
      label: 'Bill Cancellation' 
    },
  ];

  const pathMap = {
    FranchiseRegister: '/',
    FranchiseList: '/FranchiseList',
    FranchiseLocations:'/FranchiseLocations',
    InactiveFranchises:'/InactiveFranchises',
    Barcodestock:'/Barcodestock',
    Billcancel:'/Cancelledbill',
    Billcancellation:'/FinalBillcancel',
  };

  return (
    <LayoutContainer>
      {/* Mobile Toggle Button */}
      <MobileToggleButton onClick={toggleMobileSidebar}>
        <Menu size={24} />
      </MobileToggleButton>

      {/* Overlay for mobile */}
      <Overlay isOpen={isMobileOpen} onClick={closeMobileSidebar} />

      {/* Sidebar */}
      <SidebarContainer isOpen={isMobileOpen} isCollapsed={isDesktopCollapsed}>
        <SidebarHeader>
          <Logo isCollapsed={isDesktopCollapsed}>
            {isDesktopCollapsed ? 'DF' : 'Diagnostics Franchise'}
          </Logo>
          <CloseButton onClick={closeMobileSidebar}>
            <X size={24} />
          </CloseButton>
          <CollapseButton onClick={toggleDesktopSidebar}>
            <EllipsisVertical size={20} />
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav>
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => {
                setActiveItem(item.name);
                closeMobileSidebar();
                navigate(pathMap[item.name]);
              }}
            >
              <NavIcon isCollapsed={isDesktopCollapsed}>
                <item.icon size={20} />
              </NavIcon>
              <NavText isCollapsed={isDesktopCollapsed}>
                {item.label}
              </NavText>
            </NavItem>
          ))}
        </SidebarNav>
      </SidebarContainer>

      {/* Main Content Area */}
      <MainContent isCollapsed={isDesktopCollapsed}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default SidebarLayout;