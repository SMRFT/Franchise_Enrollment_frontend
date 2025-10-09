import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import {
  LiquidBackground,
  DualToneCard,
  PrimaryButton,
  // If you want, import colors for icons or accents as well
} from "./GlobalStyle"; // Adjust the path to your globals!

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to   { opacity: 1; transform: translateY(0);}
`;

const shimmer = keyframes`
  0%   { background-position: -468px 0;}
  100% { background-position: 468px 0;}
`;

const pulse = keyframes`
  0%,100% { transform: scale(1);}
  50%     { transform: scale(1.05);}
`;

// Used for the lock icon next to franchise id when auto-filled
const LockIcon = styled.span`
  position: absolute;
  right: 18px;
  top: 40px;
  font-size: 1.1em;
  color: #6c757d;
  pointer-events: none;
  opacity: 0.8;
`;

// Animation decorative shapes
const FloatingShapes = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Shape = styled.div`
  position: absolute;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  &:nth-child(1) { width:80px; height:80px; top:10%; left:18%; animation-delay:0s; }
  &:nth-child(2) { width:60px; height:60px; top:68%; right:17%; animation-delay:2s; }
  &:nth-child(3) { width:48px; height:48px; bottom:21%; left:13%; animation-delay:4s; }
  @keyframes float {
    0%,100% { transform: translateY(0) rotate(0deg);}
    50%   { transform: translateY(-20px) rotate(180deg);}
  }
`;

// Card centering
const CenterWrap = styled.div`
  min-height: 100vh; width: 100vw;
  display: flex; align-items: center; justify-content: center;
  z-index: 1;
  position: relative;
`;

const StyledDualToneCard = styled(DualToneCard)`
  width: 100%;
  max-width: 480px;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  margin: 0 8px;

  @media (max-width: 600px) {
    padding: 1.25rem 0.5rem;
    border-radius: 14px;
  }
`;

const Title = styled.h2`
  font-size: 2.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 2.2rem;
  position: relative;
  z-index: 1;
  @media (max-width: 768px) { font-size: 2rem; margin-bottom: 1.4rem; }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 1;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Select = styled.select`
  padding: 18px 24px;
  border: 2px solid ${props => props.hasError ? '#ff4757' : '#e9ecef'};
  border-radius: 15px;
  font-size: 16px;
  font-weight: 500;
  background: #f9fafe;
  transition: all 0.3s;
  outline: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 16px center; background-size: 16px; padding-right: 50px;
  &:focus { border-color: #667eea; box-shadow:0 0 0 4px #667eea22; transform: translateY(-2px);}
  &:hover:not(:focus) { border-color: #667eea; transform: translateY(-1px); }
  option { padding: 12px; font-size: 16px; }
  @media (max-width: 768px) { padding: 16px 20px; padding-right: 45px; font-size: 16px; }
`;

const Input = styled.input`
  padding: 18px 24px;
  border: 2px solid ${props => props.hasError ? '#ff4757' : '#e9ecef'};
  border-radius: 15px;
  font-size: 16px;
  font-weight: 500;
  background: #f9fafe;
  transition: all 0.3s;
  outline: none;
  position: relative;
  &:focus { border-color: #667eea; box-shadow: 0 0 0 4px #667eea22; transform: translateY(-2px);}
  &::placeholder { color: #6c757d; font-weight: 400; }
  &:hover:not(:focus) { border-color: #667eea; transform: translateY(-1px); }
  &:disabled {
    background: #f5f7fb;
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.7;
  }
  @media (max-width: 768px) { padding: 16px 20px; font-size: 16px; }
`;

const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 0.87rem;
  font-weight: 500;
  margin-left: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
  &::before { content: '⚠️'; font-size: 0.95em; }
`;

const Preprintedbarcode = () => {
  const [franchises, setFranchises] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    location: "",
    franchise_id: "",
    startbarcode: "",
    endbarcode: "",
    createdby: "",
  });
  const [errors, setErrors] = useState({});
const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  // Fetch franchise and locations
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${franchiseurl}getfranchise/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access_token"),
          },
        });
        if (resp.ok) setFranchises(await resp.json());

        const resp2 = await fetch(`${franchiseurl}getactivelocations/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access_token"),
          },
        });
        if (resp2.ok) {
          const result = await resp2.json();
          setLocations(Array.isArray(result) ? result : result.data ?? []);
        }
      } catch (e) {}
    })();
  }, []);

  // Autofill "createdby"
  useEffect(() => {
    const payload = JSON.parse(localStorage.getItem("user_payload"));
    setFormData(f => ({
      ...f,
      createdby: payload?.aud || "",
    }));
  }, []);

  // On location change, auto-fill franchise id
  const handleLocationChange = e => {
    const selectedClusterName = e.target.value;
    const selectedLocation = locations.find(
      loc => loc.Cluster_Name === selectedClusterName
    );
    let franchise_id = "";
    if (selectedLocation) {
      const matchedFranchise = franchises.find(
        f => f.location_id === selectedLocation.location_id
      );
      franchise_id = matchedFranchise?.franchise_id || "";
    }
    setFormData(prev => ({
      ...prev,
      location: selectedClusterName,
      franchise_id,
    }));
    if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startbarcode.trim())
      newErrors.startbarcode = "Start barcode is required";
    if (!formData.endbarcode.trim())
      newErrors.endbarcode = "End barcode is required";
    if (!formData.createdby.trim())
      newErrors.createdby = "Created by is required";
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = JSON.parse(localStorage.getItem("user_payload"));
    const dataToSend = { ...formData, aud: payload?.aud || "" };
    try {
      const response = await fetch(`${franchiseurl}savebarcode/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access_token"),
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Success: " + result.message);
        setFormData({
          location: "",
          franchise_id: "",
          startbarcode: "",
          endbarcode: "",
          createdby: formData.createdby,
        });
        setErrors({});
      } else if (result.message === "Already stored Between that range.") {
        alert("Info: " + result.message);
      } else {
        alert("Error: " + (result.message || "Something went wrong"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <LiquidBackground>
      <FloatingShapes>
        <Shape />
        <Shape />
        <Shape />
      </FloatingShapes>
      <CenterWrap>
        <StyledDualToneCard>
          <Title>Generate Barcode Range</Title>
          <FormContainer onSubmit={handleSubmit} autoComplete="off">
            {/* Cluster Name */}
            <InputGroup>
              <Select
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                hasError={errors.location}
                aria-label="Select Cluster Name"
              >
                <option value="">Select Cluster Name</option>
                {locations.map((location, index) => (
                  <option
                    key={location._id?.$oid || index}
                    value={location.Cluster_Name}
                  >
                    {location.Cluster_Name} - {location.District}
                  </option>
                ))}
              </Select>
              {errors.location && (
                <ErrorMessage>{errors.location}</ErrorMessage>
              )}
            </InputGroup>
            {/* Franchise ID (readonly if location picked) */}
            <InputGroup style={{ position: "relative" }}>
              <Input
                name="franchise_id"
                placeholder="Franchise ID"
                value={formData.franchise_id}
                onChange={handleChange}
                disabled
                aria-readonly="true"
                aria-label="Franchise ID"
                style={{
                  background: formData.location ? "#f2f5fa" : undefined,
                }}
              />
              {!!formData.location && (
                <LockIcon title="Auto-filled">🔒</LockIcon>
              )}
            </InputGroup>
            {/* Start Barcode */}
            <InputGroup>
              <Input
                name="startbarcode"
                placeholder="Start Barcode"
                value={formData.startbarcode}
                onChange={handleChange}
                hasError={errors.startbarcode}
                aria-label="Start Barcode"
              />
              {errors.startbarcode && (
                <ErrorMessage>{errors.startbarcode}</ErrorMessage>
              )}
            </InputGroup>
            {/* End Barcode */}
            <InputGroup>
              <Input
                name="endbarcode"
                placeholder="End Barcode"
                value={formData.endbarcode}
                onChange={handleChange}
                hasError={errors.endbarcode}
                aria-label="End Barcode"
              />
              {errors.endbarcode && (
                <ErrorMessage>{errors.endbarcode}</ErrorMessage>
              )}
            </InputGroup>
            {/* Created By */}
            <InputGroup>
              <Input
                name="createdby"
                placeholder="Created By"
                value={formData.createdby}
                onChange={handleChange}
                disabled
                aria-label="Created By"
              />
              {errors.createdby && (
                <ErrorMessage>{errors.createdby}</ErrorMessage>
              )}
            </InputGroup>
            <PrimaryButton
              type="submit"
              style={{
                fontSize: "1.1em",
                padding: "1em",
                marginTop: "8px",
                width: "100%",
                letterSpacing: "0.5px",
              }}
            >
              Generate
            </PrimaryButton>
          </FormContainer>
        </StyledDualToneCard>
      </CenterWrap>
    </LiquidBackground>
  );
};

export default Preprintedbarcode;
