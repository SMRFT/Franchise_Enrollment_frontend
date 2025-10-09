import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

// Backend URL from environment variable
const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

// Styled Components
const BarcodeCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.08);
  }
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 6px;
  color: #333;
`;

const Row = styled.div`
  margin-bottom: 8px;
`;

const BarcodeToggleForm = () => {

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
            validateStatus: () => true, // Ensure Axios doesn't throw for non-2xx codes
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
          console.error('Network or unexpected error:', error);
          return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
        }
      };
      
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchBarcodes = async () => {
  const token = localStorage.getItem("access_token");
  
  try {
    const response = await axios.get(`${franchiseurl}get_all_barcodes/`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    setBarcodes(response.data);
  } catch (error) {
    console.error("Error fetching barcodes:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBarcodes();
  }, []);

  const handleToggle = async (_id, currentStatus) => {
    try {
      await axios.patch(`${franchiseurl}update_barcode_status/${_id}/`, {
        is_active: !currentStatus,
      });

      setBarcodes(prev =>
        prev.map(item =>
          item._id === _id ? { ...item, is_active: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Barcode Status Toggle
      </Typography>
      {barcodes.map(barcode => (
        <BarcodeCard key={barcode._id}>
          <Row>
            <Label>Franchise ID:</Label> {barcode.franchise_id}
          </Row>
          <Row>
            <Label>Start Barcode:</Label> {barcode.startbarcode}
          </Row>
          <Row>
            <Label>End Barcode:</Label> {barcode.endbarcode}
          </Row>
          <Row>
            <FormControlLabel
              control={
                <Switch
                  checked={barcode.is_active}
                  onChange={() => handleToggle(barcode._id, barcode.is_active)}
                />
              }
              label={barcode.is_active ? "Active" : "Inactive"}
            />
          </Row>
        </BarcodeCard>
      ))}
    </Container>
  );
};

export default BarcodeToggleForm;
