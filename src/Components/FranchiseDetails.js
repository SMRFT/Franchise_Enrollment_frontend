"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import {
  GlobalStyle,
  PrimaryButton,
  SecondaryButton,
  Container as GlobalContainer,
  GradientCard,
  PageBackground,
  colors,
} from "./GlobalStyle"
import GradientText from "./GradientText"

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

// Container using the global background
const Container = styled(PageBackground)`
  padding: 2rem 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
`

// Details Container using GradientCard
const DetailsContainer = styled(GradientCard)`
  max-width: 1000px;
  margin: auto;
  padding: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const BackButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`

const FormSection = styled.div`
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.bright};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.bright};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
  
  option {
    background: #1f2937;
    color: #ffffff;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.bright};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }
`

const FileUploadSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const FileUploadTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const FileUploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`

const FileUploadItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FilePreview = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .file-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(33, 150, 243, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(33, 150, 243, 0.3);
  }
`

const RemoveFileButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.7);
  border: none;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.9);
    transform: scale(1.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SaveButton = styled(PrimaryButton)`
  min-width: 120px;
`

const CancelButton = styled(SecondaryButton)`
  min-width: 120px;
`

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
    border-top: 3px solid ${colors.primary.bright};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`

const SuccessMessage = styled.div`
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`

const FranchiseDetails = () => {
  const { franchiseId } = useParams()
  const navigate = useNavigate()
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL


  // apiRequest function implementation
  const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      const defaultHeaders = {
        "Authorization": token,
      };

      // Don't set Content-Type for FormData, let axios handle it
      if (!(data instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
      }

      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true, // Ensure Axios doesn't throw for non-2xx codes
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
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [employee, setEmployee] = useState({
    franchise_id: "",
    franchiser_name: "",
    location: "",
    contact_no: "",
    email: "",
    alt_number: "",
    address: "",
    qualification: "",
    age: "",
    gender: "",
    pincode: "",
    dob: "",
    is_active: false,
    aadhaar_file_id: "",
    payment_file_id: "",
    agreement_file_id: "",
    franchise_photo_file_id: "",
  })

  const [files, setFiles] = useState({
    aadhaar_file: null,
    payment_file: null,
    agreement_file: null,
    franchise_photo: null,
  })

  const [fileUrls, setFileUrls] = useState({
    aadhaar_file_url: "",
    payment_file_url: "",
    agreement_file_url: "",
    franchise_photo_url: "",
  })

  useEffect(() => {
    if (franchiseId) {
      fetchEmployeeDetails()
    }
  }, [franchiseId])

  const fetchEmployeeDetails = async () => {
    try {
      // setLoading(true)
      const response = await apiRequest(`${franchiseurl}get-franchise-edit/${franchiseId}/`)
      const employeeData = response.data

      setEmployee(employeeData)

      // Set file URLs if files exist
      const urls = {
        aadhaar_file_url: employeeData.aadhaar_file_id
          ? `${franchiseurl}get-file/${employeeData.aadhaar_file_id}/`
          : "",
        payment_file_url: employeeData.payment_file_id
          ? `${franchiseurl}get-file/${employeeData.payment_file_id}/`
          : "",
        agreement_file_url: employeeData.agreement_file_id
          ? `${franchiseurl}get-file/${employeeData.agreement_file_id}/`
          : "",
        franchise_photo_url: employeeData.franchise_photo_file_id
          ? `${franchiseurl}get-file/${employeeData.franchise_photo_file_id}/`
          : "",
      }

      setFileUrls(urls)
    } catch (error) {
      console.error("Error fetching employee details:", error)
      setError("Failed to load employee details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEmployee({
      ...employee,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target

    if (selectedFiles && selectedFiles[0]) {
      // Create a preview URL for the file
      const fileUrl = URL.createObjectURL(selectedFiles[0])

      setFiles({
        ...files,
        [name]: selectedFiles[0],
      })

      setFileUrls({
        ...fileUrls,
        [`${name}_url`]: fileUrl,
      })
    }
  }

  const removeFile = (fileType) => {
    setFiles({
      ...files,
      [fileType]: null,
    })

    setFileUrls({
      ...fileUrls,
      [`${fileType}_url`]: "",
    })

    // If we're removing an existing file (not a new upload)
    if (!files[fileType] && employee[`${fileType}_id`]) {
      setEmployee({
        ...employee,
        [`${fileType}_id`]: null,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      // Create form data for submission
      const formData = new FormData()

      // Add all employee fields
      Object.keys(employee).forEach((key) => {
        if (employee[key] !== null && employee[key] !== undefined) {
          formData.append(key, employee[key])
        }
      })

      // Add files if they exist
      if (files.aadhaar_file) formData.append("aadhaar_file", files.aadhaar_file)
      if (files.payment_file) formData.append("payment_file", files.payment_file)
      if (files.agreement_file) formData.append("agreement_file", files.agreement_file)
      if (files.franchise_photo) formData.append("franchise_photo", files.franchise_photo)

      // Submit the form using apiRequest
      const response = await apiRequest(
        `${franchiseurl}update-franchise/${franchiseId}/`, 
        'POST', 
        formData
      )

      if (response.success) {
        // Update the employee data with the response
        setEmployee(response.data)
        setSuccess("Franchise details updated successfully!")
        setEditMode(false)

        // Refresh the data
        await fetchEmployeeDetails()
      } else {
        // Handle different error scenarios
        let errorMessage = 'Failed to update franchise details. Please try again.';
        
        if (response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        } else if (response.status === 404) {
          errorMessage = 'Franchise not found. Please check the franchise ID.';
        } else if (response.networkError) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (response.error) {
          errorMessage = response.error;
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      setError("An unexpected error occurred while updating. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const toggleEditMode = () => {
    setEditMode(!editMode)
    if (!editMode) {
      // Reset any error/success messages when entering edit mode
      setError("")
      setSuccess("")
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    fetchEmployeeDetails() // Reset to original data
    setError("")
    setSuccess("")
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""

    // Convert to YYYY-MM-DD format for input type="date"
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const renderFilePreview = (fileType, fileUrl, label, icon) => {
    return (
      <FileUploadItem>
        <Label>{label}</Label>
        <FilePreview>
          {fileUrl ? (
            <>
              {fileType === "franchise_photo" ? (
                <img src={fileUrl || "/placeholder.svg"} alt={label} />
              ) : (
                <div>
                  <div className="file-icon">{icon}</div>
                  <div>File Uploaded</div>
                </div>
              )}
              {editMode && (
                <RemoveFileButton type="button" onClick={() => removeFile(fileType)} title="Remove file">
                  ×
                </RemoveFileButton>
              )}
            </>
          ) : (
            <>
              <div>
                <div className="file-icon">{icon}</div>
                <div>No file uploaded</div>
              </div>
            </>
          )}
        </FilePreview>
        {editMode && (
          <>
            <FileInput
              type="file"
              id={fileType}
              name={fileType}
              onChange={handleFileChange}
              accept={fileType === "franchise_photo" ? "image/*" : ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
            />
            <FileInputLabel htmlFor={fileType}>{fileUrl ? "Change File" : "Upload File"}</FileInputLabel>
          </>
        )}
      </FileUploadItem>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <GlobalContainer>
          <DetailsContainer>
            <Header>
              <BackButton onClick={() => navigate(-1)}>← Back to List</BackButton>

              {!loading && !editMode && <PrimaryButton onClick={toggleEditMode}>Edit Details</PrimaryButton>}
            </Header>

          <GradientText
            colors={["#004d4d", "#008080", "#26cccc", "#48d1cc", "#7fdfdf", "#26cccc", "#008080"]}
            animationSpeed={4}
            showBorder={false}
            className="custom-class"
          >
              {editMode ? "Edit Employee Details" : "Employee Details"}
            </GradientText>

            {loading ? (
              <LoadingSpinner>Loading employee details...</LoadingSpinner>
            ) : (
              <FormSection>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <form onSubmit={handleSubmit}>
                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="franchiser_name">Franchiser Name</Label>
                      <Input
                        type="text"
                        id="franchiser_name"
                        name="franchiser_name"
                        value={employee.franchiser_name || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="franchise_id">Franchise ID</Label>
                      <Input
                        type="text"
                        id="franchise_id"
                        name="franchise_id"
                        value={employee.franchise_id || ""}
                        onChange={handleInputChange}
                        disabled={true} // ID should not be editable
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        type="text"
                        id="location"
                        name="location"
                        value={employee.location || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="contact_no">Contact Number</Label>
                      <Input
                        type="text"
                        id="contact_no"
                        name="contact_no"
                        value={employee.contact_no || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={employee.email || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="alt_number">Alternative Number</Label>
                      <Input
                        type="text"
                        id="alt_number"
                        name="alt_number"
                        value={employee.alt_number || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={employee.qualification || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        type="number"
                        id="age"
                        name="age"
                        value={employee.age || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        id="gender"
                        name="gender"
                        value={employee.gender || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={employee.pincode || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formatDate(employee.dob)}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="is_active">Status</Label>
                      <Select
                        id="is_active"
                        name="is_active"
                        value={employee.is_active ? "true" : "false"}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "is_active",
                              value: e.target.value === "true",
                              type: "checkbox",
                              checked: e.target.value === "true",
                            },
                          })
                        }
                        disabled={!editMode}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Select>
                    </FormGroup>
                  </FormGrid>

                  <FormGroup>
                    <Label htmlFor="address">Address</Label>
                    <TextArea
                      id="address"
                      name="address"
                      value={employee.address || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </FormGroup>

                  <FileUploadSection>
                    <FileUploadTitle>Documents & Photo</FileUploadTitle>
                    <FileUploadGrid>
                      {renderFilePreview("franchise_photo", fileUrls.franchise_photo_url, "Franchise Photo", "📷")}
                      {renderFilePreview("aadhaar_file", fileUrls.aadhaar_file_url, "Aadhaar Card", "🆔")}
                      {renderFilePreview("payment_file", fileUrls.payment_file_url, "Payment Proof", "💳")}
                      {renderFilePreview("agreement_file", fileUrls.agreement_file_url, "Agreement", "📄")}
                    </FileUploadGrid>
                  </FileUploadSection>

                  {editMode && (
                    <ButtonGroup>
                      <CancelButton type="button" onClick={handleCancel}>
                        Cancel
                      </CancelButton>
                      <SaveButton type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </SaveButton>
                    </ButtonGroup>
                  )}
                </form>
              </FormSection>
            )}
          </DetailsContainer>
        </GlobalContainer>
      </Container>
    </>
  )
}

export default FranchiseDetails
