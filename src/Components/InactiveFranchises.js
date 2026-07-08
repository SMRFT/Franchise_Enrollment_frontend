"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import styled from "styled-components"

const CardWrapper = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const CardTitle = styled.h5`
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const CardText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
`

const ResendButton = styled.button`
  margin-top: 1rem;
  margin-right: 0.5rem;
  background-color: ${(props) => (props.expired ? "#dc3545" : "#256565")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background-color: ${(props) => (props.expired ? "#c82333" : "#1a4a4a")};
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`

const BulkActions = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => (props.expired ? "#f8d7da" : "#fff3cd")};
  color: ${(props) => (props.expired ? "#721c24" : "#856404")};
`

const InactiveFranchises = () => {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchises, setSelectedFranchises] = useState([])
  const [loading, setLoading] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  useEffect(() => {
    fetchInactiveFranchises()
  }, [])

  const fetchInactiveFranchises = () => {
    setLoading(true)
    axios
      .get(`${franchiseurl}inactive-franchises/`)
      .then((res) => {
        setFranchises(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching franchises", err)
        setLoading(false)
      })
  }

  const handleResend = async (franchiseId) => {
    try {
      setLoading(true)
      const response = await axios.post(`${franchiseurl}resend-password-reset/`, {
        franchise_id: franchiseId,
      })

      alert(`✅ ${response.data.message}`)
      fetchInactiveFranchises() // Refresh the list
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to resend email"
      alert(`❌ Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkResend = async () => {
    if (selectedFranchises.length === 0) {
      alert("Please select at least one franchise")
      return
    }

    if (!window.confirm(`Are you sure you want to resend emails to ${selectedFranchises.length} franchises?`)) {
      return
    }

    try {
      setBulkLoading(true)
      const response = await axios.post(`${franchiseurl}bulk-resend-password-reset/`, {
        franchise_ids: selectedFranchises,
      })

      alert(`✅ ${response.data.message}`)
      setSelectedFranchises([])
      fetchInactiveFranchises() // Refresh the list
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Bulk resend failed"
      alert(`❌ Error: ${errorMessage}`)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleSelectFranchise = (franchiseId) => {
    setSelectedFranchises((prev) =>
      prev.includes(franchiseId) ? prev.filter((id) => id !== franchiseId) : [...prev, franchiseId],
    )
  }

  const handleSelectAll = () => {
    if (selectedFranchises.length === franchises.length) {
      setSelectedFranchises([])
    } else {
      setSelectedFranchises(franchises.map((f) => f.franchise_id))
    }
  }

  if (loading && franchises.length === 0) {
    return <div className="text-center mt-4">Loading inactive franchises...</div>
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inactive Franchises ({franchises.length})</h2>
        <button
          className="btn btn-outline-primary"
          style={{ color: "#256565", borderColor: "#256565" }}
          onClick={fetchInactiveFranchises}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {franchises.length > 0 && (
        <BulkActions>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedFranchises.length === franchises.length}
                onChange={handleSelectAll}
                className="me-2"
              />
              <label htmlFor="selectAll">Select All ({selectedFranchises.length} selected)</label>
            </div>
            <button
              className="btn btn-warning"
              style={{ backgroundColor: "#256565", borderColor: "#256565", color: "white" }}
              onClick={handleBulkResend}
              disabled={selectedFranchises.length === 0 || bulkLoading}
            >
              {bulkLoading ? "Sending..." : `Bulk Resend (${selectedFranchises.length})`}
            </button>
          </div>
        </BulkActions>
      )}

      {franchises.length === 0 ? (
        <div className="text-center mt-5">
          <h4>🎉 No Inactive Franchises</h4>
          <p>All franchises have completed their account setup!</p>
        </div>
      ) : (
        <div className="row">
          {franchises.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.franchise_id}>
              <CardWrapper>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFranchises.includes(item.franchise_id)}
                    onChange={() => handleSelectFranchise(item.franchise_id)}
                  />
                  <StatusBadge expired={item.is_expired}>{item.is_expired ? "Expired" : "Active"}</StatusBadge>
                </div>

                <CardTitle>{item.franchise_name || "Unknown Franchise"}</CardTitle>
                <CardText>
                  <strong>ID:</strong> {item.franchise_id}
                </CardText>
                <CardText>
                  <strong>Email:</strong> {item.email || "No email"}
                </CardText>
                <CardText>
                  <strong>Phone:</strong> {item.phone || "No phone"}
                </CardText>
                <CardText>
                  <strong>Location:</strong> {item.location || "No location"}
                </CardText>

                {item.reset_token_expires && (
                  <CardText>
                    <strong>Expires:</strong> {new Date(item.reset_token_expires).toLocaleString()}
                  </CardText>
                )}

                <ResendButton
                  expired={item.is_expired}
                  onClick={() => handleResend(item.franchise_id)}
                  disabled={loading}
                >
                  {item.is_expired ? "🚨 Resend (Expired)" : "📧 Resend Email"}
                </ResendButton>
              </CardWrapper>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InactiveFranchises