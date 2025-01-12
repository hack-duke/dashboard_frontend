import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicantCard = () => {
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/applicants?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
      setCurrentIndex(0);
    };

    fetchApplicants();
  }, [statusFilter]);

  const handleStatusChange = async (newStatus) => {
    const applicant = applicants[currentIndex];
    await axios.put(
      `/applicants/${applicant._id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const updatedApplicants = [...applicants];
    updatedApplicants[currentIndex].status = newStatus;
    setApplicants(updatedApplicants);
  };

  const currentApplicant = applicants[currentIndex];

  // Filter controls component
  const FilterControls = () => (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => setStatusFilter("pending")}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: statusFilter === "pending" ? '#FFA500' : '#f5f5f5',
          color: statusFilter === "pending" ? 'white' : 'black',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Pending Applications
      </button>
      <button 
        onClick={() => setStatusFilter("accepted")}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: statusFilter === "accepted" ? '#4CAF50' : '#f5f5f5',
          color: statusFilter === "accepted" ? 'white' : 'black',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Accepted Applications
      </button>
      <button 
        onClick={() => setStatusFilter("rejected")}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: statusFilter === "rejected" ? '#f44336' : '#f5f5f5',
          color: statusFilter === "rejected" ? 'white' : 'black',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Rejected Applications
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <FilterControls />
      {currentApplicant ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Left column - Applicant Details */}
          <div style={{ flex: '1', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            <h2>Applicant Details</h2>
            <div style={{ 
              marginBottom: '20px', 
              padding: '10px', 
              backgroundColor: getStatusColor(currentApplicant.status),
              borderRadius: '4px',
              color: 'white'
            }}>
              <h3 style={{ margin: '0' }}>Status: {currentApplicant.status.toUpperCase()}</h3>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3>Personal Information</h3>
              <p><strong>Full Name:</strong> {currentApplicant.name}</p>
              <p><strong>Preferred Name:</strong> {currentApplicant.prefName}</p>
              <p><strong>Age:</strong> {currentApplicant.age}</p>
              <p><strong>Country:</strong> {currentApplicant.country}</p>
              <p><strong>Email:</strong> {currentApplicant.email}</p>
              <p><strong>Phone:</strong> {currentApplicant.phone}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Academic Information</h3>
              <p><strong>University:</strong> {currentApplicant.university}</p>
              <p><strong>Major:</strong> {currentApplicant.major}</p>
              <p><strong>Graduation Year:</strong> {currentApplicant.graduationYear}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Application Essays</h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Why HackDuke?</strong>
                <p>{currentApplicant.whyhackduke}</p>
              </div>
              <div>
                <strong>Why This Track?</strong>
                <p>{currentApplicant.whytrack}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => handleStatusChange("accepted")} 
                      style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>
                Accept
              </button>
              <button onClick={() => handleStatusChange("rejected")}
                      style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>
                Reject
              </button>
              <button onClick={() => handleStatusChange("pending")}
                      style={{ backgroundColor: '#FFA500', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>
                Pending
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                      style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                Previous
              </button>
              <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, applicants.length - 1))}
                      style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                Next
              </button>
            </div>
          </div>

          {/* Right column - Resume */}
          <div style={{ flex: '1.5' }}>
            <iframe 
              src={currentApplicant.resumeUrl} 
              title="Resume"
              style={{
                width: '100%',
                height: 'calc(100vh - 40px)',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            ></iframe>
          </div>
        </div>
      ) : (
        <p>No applicants available</p>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
      return '#4CAF50';
    case 'rejected':
      return '#f44336';
    case 'pending':
      return '#FFA500';
    default:
      return '#808080';
  }
};

export default ApplicantCard;
