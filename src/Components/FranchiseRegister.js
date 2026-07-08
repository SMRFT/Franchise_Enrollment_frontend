// src/components/EmployeeRegister.js
import { useState } from "react"
import styled, { keyframes } from "styled-components"
import GradientText from "./GradientText"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect } from "react"
import {
  GlobalStyle,
  PrimaryButton,
  Container as GlobalContainer,
  GradientCard,
  PageBackground,
  colors,
} from "./GlobalStyle"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const toastSlideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const toastSlideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`

// Updated Container using the global background
const Container = styled(PageBackground)`
  padding: 2rem 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

// Updated FormContainer using GradientCard
const FormContainer = styled(GradientCard)`
  max-width: 1200px;
  margin: auto;
  padding: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
`

const FormSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
`

const SectionTitle = styled.h4`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  position: relative;
  padding-left: 1rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: ${colors.gradients.accent};
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
  }
`

const StyledInput = styled.input`
  border: 2px solid ${props => props.isInvalid ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 0.700rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #ffffff;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.isInvalid ? '#ef4444' : colors.primary.bright};
    box-shadow: 0 0 0 3px ${props => props.isInvalid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(33, 150, 243, 0.2)'};
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: ${props => props.isInvalid ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-1px);
  }
  
  &[readonly] {
    background: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    opacity: 0.8;
  }
`

const StyledSelect = styled.select`
  border: 2px solid ${props => props.isInvalid ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #ffffff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.isInvalid ? '#ef4444' : colors.primary.bright};
    box-shadow: 0 0 0 3px ${props => props.isInvalid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(33, 150, 243, 0.2)'};
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: ${props => props.isInvalid ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-1px);
  }
  
  option {
    background-color: ${colors.primary.deepNavy};
    color: #000000ff;
    padding: 0.5rem;
    font-weight: 500;
  }
`

const ValidationError = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
`

// Toggle Switch Styles
const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`

const ToggleLabel = styled.label`
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
`

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${(props) => (props.isActive ? colors.primary.bright : "rgba(255, 255, 255, 0.3)")};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.isActive ? `0 0 10px rgba(33, 150, 243, 0.5)` : "none")};
  
  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${(props) => (props.isActive ? "33px" : "3px")};
    width: 24px;
    height: 24px;
    background: #ffffff;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    transform: scale(1.05);
  }
`

const FileUploadWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
`

const FileInput = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
`

const FileLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0.5rem;
  border: 2px dashed ${props => props.isInvalid ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  min-height: 80px;
  
  &:hover {
    border-color: ${props => props.isInvalid ? '#ef4444' : colors.primary.bright};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px ${props => props.isInvalid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(33, 150, 243, 0.2)'};
  }
  
  &::before {
    content: '📁';
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    filter: brightness(1.2);
  }
`

const FileText = styled.span`
  font-size: 0.85rem;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
`

const FileName = styled.span`
  margin-top: 0.5rem;
  color: ${colors.primary.light};
  font-weight: 500;
  font-size: 0.8rem;
  display: block;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  background: rgba(66, 165, 245, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
`

const FileRemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const FileNameContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

// Using Global Button Styles
const SubmitButton = styled(PrimaryButton)`
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
`

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`

// Toast Notification Styles - Updated for dark theme
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Toast = styled.div`
  display: flex;
  align-items: center;
  min-width: 350px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${(props) => (props.isExiting ? toastSlideOut : toastSlideIn)} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(135deg, #10b981, #059669)"
      : "linear-gradient(135deg, #ef4444, #dc2626)"};
  
  color: white;
  
  @media (max-width: 480px) {
    min-width: calc(100vw - 40px);
    margin: 0 10px;
  }
`

const ToastIcon = styled.div`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`

const ToastContent = styled.div`
  flex: 1;
`

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
`

const ToastMessage = styled.div`
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
`

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const ToastProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: ${progressBar} ${(props) => props.duration}ms linear;
`

const FranchiseRegister = () => {
  
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

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
                validateStatus: () => true, // Prevent Axios from throwing on non-2xx
              };

              if (data && (method === 'POST' || method === 'PUT' || method === 'GET')) {
                config.data = data;
              }

              const response = await axios(config);

              if (response.status === 200 || response.status === 201) {
                // ✅ Handle both 200 OK and 201 Created as success
                return { success: true, data: response.data, status: response.status };
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

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Helper function to calculate age from current date
  const getCurrentAge = () => {
    return 0 // Default age when current date is selected
  }

  const currentDate = getCurrentDate()

  const [formData, setFormData] = useState({
    franchise_id: "",
    franchise_name: "",
    location_id: "",
    contact_no: "",
    email: "",
    alt_number: "",
    address: "",
    qualification: "",
    age: getCurrentAge(),
    gender: "",
    pincode: "",
    dob: currentDate,
    initialpayment: "No",
    paymentmethod: "",
    paymentmode: "",
   
  })

  // File states
  const [aadhaarFile, setAadhaarFile] = useState(null)
  const [paymentFile, setPaymentFile] = useState(null)
  const [agreementFile, setAgreementFile] = useState(null)
  const [franchisePhotoFile, setFranchisePhotoFile] = useState(null)
  const [toasts, setToasts] = useState([])
  const [locations, setLocations] = useState([])
  const [franchiseFeeChecked, setFranchiseFeeChecked] = useState(false)
  const [transactionId, setTransactionId] = useState("");

  // Validation states
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
  const fetchInitialData = async () => {
    const idResponse = await apiRequest(`${franchiseurl}getnextfranchiseid/`, 'GET');
    if (idResponse.success) {
      setFormData((prev) => ({
        ...prev,
        franchise_id: idResponse.data.franchise_id
      }));
    }
  };
  fetchInitialData();
}, []);

  // Updated useEffect to use apiRequest function
useEffect(() => {
  const fetchLocations = async () => {
    try {
      const response = await apiRequest(`${franchiseurl}getactivelocations/`, 'GET');
     
      if (response.success) {
        setLocations(response.data);
      } else {
        console.error("Error fetching franchise locations:", response.error);
        showToast("error", "Error", "Failed to fetch franchise locations");
      }
    } catch (error) {
      console.error("Error fetching franchise locations:", error);
      showToast("error", "Error", "Network error while fetching locations");
    }
  };

  fetchLocations();
}, [franchiseurl]);

  const showToast = (type, title, message) => {
    const id = Date.now()
    const newToast = { id, type, title, message, isExiting: false }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)))

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Basic Information
    if (!formData.franchise_name.trim()) {
      errors.franchise_name = "Franchise name is required";
    }
    if (!formData.location) {
      errors.location = "Cluster name is required";
    }
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    }

    // Contact Details
    if (!formData.contact_no.trim()) {
      errors.contact_no = "Primary contact is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.address.trim()) {
      errors.address = "Full address is required";
    }

    // Personal Information
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    }
    if (!formData.age || formData.age <= 0) {
      errors.age = "Valid age is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.qualification.trim()) {
      errors.qualification = "Educational qualification is required";
    }

    // Document Upload
    if (!aadhaarFile) {
      errors.aadhaarFile = "Aadhaar proof is required";
    }
    if (!paymentFile) {
      errors.paymentFile = "Payment receipt is required";
    }
    if (!agreementFile) {
      errors.agreementFile = "Agreement document is required";
    }
    if (!franchisePhotoFile) {
      errors.franchisePhotoFile = "Franchise photo is required";
    }



    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  // Handle location selection and auto-populate franchise ID
  const handleLocationChange = (e) => {
  const selectedId = e.target.value;
  setFormData((prev) => ({
    ...prev,
    location: selectedId  // store location_id instead of name
  }));
 
  // Clear validation error
  if (validationErrors.location) {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.location;
      return newErrors;
    });
  }
};

  const handleDOBChange = (e) => {
    const dob = e.target.value
    const age = calculateAge(dob)
    setFormData({ ...formData, dob, age })
   
    // Clear validation errors
    if (validationErrors.dob) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dob;
        return newErrors;
      });
    }
  }

  // Add a new handler function for age changes after the handleDOBChange function
  const handleAgeChange = (e) => {
    const age = Number.parseInt(e.target.value) || 0
    const dob = calculateDOBFromAge(age)
    setFormData({ ...formData, age, dob })
   
    // Clear validation error
    if (validationErrors.age) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.age;
        return newErrors;
      });
    }
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Add a new function to calculate DOB from age after the calculateAge function
  const calculateDOBFromAge = (age) => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    const month = today.getMonth()
    const day = today.getDate()
    const dob = new Date(birthYear, month, day)

    // Format as YYYY-MM-DD for input[type="date"]
    return dob.toISOString().split("T")[0]
  }

  // File change handlers with validation clearing
  const handleAadhaarFileChange = (e) => {
    setAadhaarFile(e.target.files[0])
    if (validationErrors.aadhaarFile) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.aadhaarFile;
        return newErrors;
      });
    }
  }

  const handlePaymentFileChange = (e) => {
    setPaymentFile(e.target.files[0])
    if (validationErrors.paymentFile) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentFile;
        return newErrors;
      });
    }
  }

  const handleAgreementFileChange = (e) => {
    setAgreementFile(e.target.files[0])
    if (validationErrors.agreementFile) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.agreementFile;
        return newErrors;
      });
    }
  }

  const handleFranchisePhotoChange = (e) => {
    setFranchisePhotoFile(e.target.files[0])
    if (validationErrors.franchisePhotoFile) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.franchisePhotoFile;
        return newErrors;
      });
    }
  }

  // File removal handlers
  const removeAadhaarFile = () => {
    setAadhaarFile(null)
    const fileInput = document.getElementById("aadhaar-upload")
    if (fileInput) fileInput.value = ""
  }

  const removePaymentFile = () => {
    setPaymentFile(null)
    const fileInput = document.getElementById("payment-upload")
    if (fileInput) fileInput.value = ""
  }

  const removeAgreementFile = () => {
    setAgreementFile(null)
    const fileInput = document.getElementById("agreement-upload")
    if (fileInput) fileInput.value = ""
  }

  const removeFranchisePhotoFile = () => {
    setFranchisePhotoFile(null)
    const fileInput = document.getElementById("franchise-photo-upload")
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Validate form before submission
  if (!validateForm()) {
    setIsSubmitting(false);
    showToast("error", "Validation Error", "Please fill in all required fields correctly.");
    return;
  }

  const data = new FormData();

  // Add other form values with transformations
const updatedFormData = {
  ...formData,
  location_id: formData.location,
  initialpayment: franchiseFeeChecked ? "10000" : "No",
};

  for (const key in updatedFormData) {
    data.append(key, updatedFormData[key]);
  }

  // Append files
  if (aadhaarFile) data.append("aadhaar_proof", aadhaarFile);
  if (paymentFile) data.append("payment_proof", paymentFile);
  if (agreementFile) data.append("agreement_proof", agreementFile);
  if (franchisePhotoFile) data.append("franchise_photo", franchisePhotoFile);

  try {
    const response = await apiRequest(
      `${franchiseurl}franchiseregister/`,
      "POST",
      data,
      { "Content-Type": "multipart/form-data" }
    );

    if (response.success) {
      showToast("success", "Registration Successful!", "Franchiser has been registered successfully.");

      // Reset form
      setFormData({
        franchise_id: "",
        franchise_name: "",
        location_id: "",
        contact_no: "",
        email: "",
        alt_number: "",
        address: "",
        qualification: "",
        age: getCurrentAge(),
        gender: "",
        pincode: "",
        dob: currentDate,
      });

      // Reset all files
      setAadhaarFile(null);
      setPaymentFile(null);
      setAgreementFile(null);
      setFranchisePhotoFile(null);

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));

      // Reset payment mode fields
    
 
      setFranchiseFeeChecked(false);
     
      // Clear validation errors
      setValidationErrors({});
    } else {
      const errorMessage = response.data?.message || response.error || "Registration failed";
      showToast("error", "Registration Failed", errorMessage);
      console.error("API Error:", response.data || response.error);
    }
  } catch (error) {
    console.error("Catch block error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Network error or unexpected issue occurred during registration.";
    showToast("error", "Registration Failed", errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <GlobalStyle />
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} isExiting={toast.isExiting}>
            <ToastIcon>{toast.type === "success" ? "✅" : "❌"}</ToastIcon>
            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>✕</ToastCloseButton>
            <ToastProgress duration={5000} />
          </Toast>
        ))}
      </ToastContainer>

      <Container>
        <GlobalContainer>
          <FormContainer>
          <GradientText
            colors={["#004d4d", "#008080", "#26cccc", "#48d1cc", "#7fdfdf", "#26cccc", "#008080"]}
            animationSpeed={4}
            showBorder={false}
            className="custom-class"
          >
            Franchise Enrollment
          </GradientText>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <FormSection delay="0.1s">
                <SectionTitle>Basic Information</SectionTitle>
                <FormRow>
                  <div className="row">
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="franchise_id"
                        placeholder="Franchise ID"
                        value={formData.franchise_id}
                        onChange={handleChange}
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="franchise_name"
                        placeholder="Franchise Name *"
                        value={formData.franchise_name}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.franchise_name}
                      />
                      {validationErrors.franchise_name && (
                        <ValidationError>{validationErrors.franchise_name}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledSelect
                        name="location"
                        value={formData.location}
                        onChange={handleLocationChange}
                        className="form-control"
                        isInvalid={validationErrors.location}
                      >
                        <option value="">Select Cluster Name *</option>
                        {locations.map((location, index) => (
                          <option key={index} value={location.location_id}>
                            {location.Cluster_Name}
                          </option>
                        ))}
                      </StyledSelect>
                      {validationErrors.location && (
                        <ValidationError>{validationErrors.location}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="pincode"
                        placeholder="Pincode *"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.pincode}
                      />
                      {validationErrors.pincode && (
                        <ValidationError>{validationErrors.pincode}</ValidationError>
                      )}
                    </div>
                  </div>
                </FormRow>
              </FormSection>

              <FormSection delay="0.2s">
                <SectionTitle>Contact Details</SectionTitle>
                <FormRow>
                  <div className="row">
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="contact_no"
                        placeholder="Primary Contact *"
                        value={formData.contact_no}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.contact_no}
                      />
                      {validationErrors.contact_no && (
                        <ValidationError>{validationErrors.contact_no}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="alt_number"
                        placeholder="Alternative Contact"
                        value={formData.alt_number}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="email"
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.email}
                      />
                      {validationErrors.email && (
                        <ValidationError>{validationErrors.email}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="address"
                        placeholder="Full Address *"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.address}
                      />
                      {validationErrors.address && (
                        <ValidationError>{validationErrors.address}</ValidationError>
                      )}
                    </div>
                  </div>
                </FormRow>
              </FormSection>

              <FormSection delay="0.3s">
                <SectionTitle>Personal Information</SectionTitle>
                <FormRow>
                  <div className="row">
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        type="date"
                        name="dob"
                        placeholder="Date of Birth *"
                        value={formData.dob}
                        onChange={handleDOBChange}
                        className="form-control"
                        isInvalid={validationErrors.dob}
                      />
                      {validationErrors.dob && (
                        <ValidationError>{validationErrors.dob}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="age"
                        type="number"
                        min="0"
                        max="120"
                        placeholder="Age *"
                        value={formData.age}
                        onChange={handleAgeChange}
                        className="form-control"
                        isInvalid={validationErrors.age}
                      />
                      {validationErrors.age && (
                        <ValidationError>{validationErrors.age}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledSelect
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.gender}
                      >
                        <option value="">Select Gender *</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </StyledSelect>
                      {validationErrors.gender && (
                        <ValidationError>{validationErrors.gender}</ValidationError>
                      )}
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <StyledInput
                        name="qualification"
                        placeholder="Educational Qualification *"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="form-control"
                        isInvalid={validationErrors.qualification}
                      />
                      {validationErrors.qualification && (
                        <ValidationError>{validationErrors.qualification}</ValidationError>
                      )}
                    </div>
                  </div>
                </FormRow>
              </FormSection>

              <FormSection delay="0.4s">
                <SectionTitle>Document Upload</SectionTitle>
                <FormRow>
                  <div className="row">
                    <div className="col-lg-3 col-md-6 mb-3">
                      <FileUploadWrapper>
                        <FileInput type="file" id="aadhaar-upload" onChange={handleAadhaarFileChange} accept="*" />
                        <FileLabel htmlFor="aadhaar-upload" isInvalid={validationErrors.aadhaarFile}>
                          <FileText>Aadhaar Proof *</FileText>
                        </FileLabel>
                        {aadhaarFile && (
                          <FileNameContainer>
                            <FileName>{aadhaarFile.name}</FileName>
                            <FileRemoveButton onClick={removeAadhaarFile} type="button">
                              ✕
                            </FileRemoveButton>
                          </FileNameContainer>
                        )}
                        {validationErrors.aadhaarFile && (
                          <ValidationError>{validationErrors.aadhaarFile}</ValidationError>
                        )}
                      </FileUploadWrapper>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <FileUploadWrapper>
                        <FileInput type="file" id="payment-upload" onChange={handlePaymentFileChange} accept="*" />
                        <FileLabel htmlFor="payment-upload" isInvalid={validationErrors.paymentFile}>
                          <FileText>Payment Receipt *</FileText>
                        </FileLabel>
                        {paymentFile && (
                          <FileNameContainer>
                            <FileName>{paymentFile.name}</FileName>
                            <FileRemoveButton onClick={removePaymentFile} type="button">
                              ✕
                            </FileRemoveButton>
                          </FileNameContainer>
                        )}
                        {validationErrors.paymentFile && (
                          <ValidationError>{validationErrors.paymentFile}</ValidationError>
                        )}
                      </FileUploadWrapper>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <FileUploadWrapper>
                        <FileInput type="file" id="agreement-upload" onChange={handleAgreementFileChange} accept="*" />
                        <FileLabel htmlFor="agreement-upload" isInvalid={validationErrors.agreementFile}>
                          <FileText>Agreement Document *</FileText>
                        </FileLabel>
                        {agreementFile && (
                          <FileNameContainer>
                            <FileName>{agreementFile.name}</FileName>
                            <FileRemoveButton onClick={removeAgreementFile} type="button">
                              ✕
                            </FileRemoveButton>
                          </FileNameContainer>
                        )}
                        {validationErrors.agreementFile && (
                          <ValidationError>{validationErrors.agreementFile}</ValidationError>
                        )}
                      </FileUploadWrapper>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-3">
                      <FileUploadWrapper>
                        <FileInput
                          type="file"
                          id="franchise-photo-upload"
                          onChange={handleFranchisePhotoChange}
                          accept="*"
                        />
                        <FileLabel htmlFor="franchise-photo-upload" isInvalid={validationErrors.franchisePhotoFile}>
                          <FileText>Franchise Photo *</FileText>
                        </FileLabel>
                        {franchisePhotoFile && (
                          <FileNameContainer>
                            <FileName>{franchisePhotoFile.name}</FileName>
                            <FileRemoveButton onClick={removeFranchisePhotoFile} type="button">
                              ✕
                            </FileRemoveButton>
                          </FileNameContainer>
                        )}
                        {validationErrors.franchisePhotoFile && (
                          <ValidationError>{validationErrors.franchisePhotoFile}</ValidationError>
                        )}
                      </FileUploadWrapper>
                    </div>
                  </div>
                </FormRow>
              </FormSection>

            <FormSection delay="0.5s">
              <SectionTitle>Payment Mode</SectionTitle>

              <div className="d-flex align-items-center flex-wrap gap-3 mb-3">

                {/* Franchise Fee Checkbox */}
                <div className="d-flex align-items-center me-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="franchiseFee"
                      checked={franchiseFeeChecked}
                      onChange={(e) => setFranchiseFeeChecked(e.target.checked)}
                    />
                    <label className="form-check-label text-white" htmlFor="franchiseFee">
                      Franchise Fee
                    </label>
                  </div>
                </div>

                {/* Initial Payment Display */}
                {franchiseFeeChecked && (
                  <div className="me-3">
                    <label style={{ color: "#fff", fontWeight: "500", marginRight: "8px" }}>
                      Initial Payment:
                    </label>
                    <StyledInput
                      type="text"
                      value="10000"
                      style={{ width: "100px" }}
                      readOnly
                    />
                  </div>
                )}


              </div>
             

            </FormSection>

              <FormSection delay="0.5s">
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <SubmitButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Register Franchise"}
                    </SubmitButton>
                  </div>
                </div>
              </FormSection>
            </form>
          </FormContainer>
        </GlobalContainer>
      </Container>
    </>
  )
}

export default FranchiseRegister