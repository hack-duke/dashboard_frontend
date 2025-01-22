import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from '../config';

const SearchBar = React.memo(({ onSearch, resultCount }) => {
  return (
    <div style={{ 
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, university, or email..."
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: '40px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8px',
            padding: '8px',
            color: '#666'
          }}
        >
          🔍
        </div>
      </div>
      <div style={{
        color: '#666',
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}>
        {resultCount} matching results
      </div>
    </div>
  );
});

const FilterControls = React.memo(({ statusFilter, setStatusFilter }) => (
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
));

const ApplicantCard = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/applicants/counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCounts(res.data);
    };

    fetchCounts();
  }, []);

  const updateCounts = (oldStatus, newStatus) => {
    setCounts(prev => ({
      ...prev,
      [oldStatus]: prev[oldStatus] - 1,
      [newStatus]: prev[newStatus] + 1
    }));
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/applicants?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
      setFilteredApplicants(res.data);
      setCurrentIndex(0);
    };

    fetchApplicants();
  }, [statusFilter]);

  useEffect(() => {
    const filtered = applicants.filter(applicant => 
      applicant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplicants(filtered);
    if (filtered.length === 0 || currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [searchQuery, applicants]);

  const handleStatusChange = async (newStatus) => {
    const applicant = applicants[currentIndex];
    const oldStatus = applicant.status;
    
    await axios.put(
      `${API_URL}/applicants/${applicant._id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const updatedApplicants = [...applicants];
    updatedApplicants[currentIndex].status = newStatus;
    setApplicants(updatedApplicants);
    updateCounts(oldStatus, newStatus);
  };

  const currentApplicant = filteredApplicants[currentIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Application Statistics</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, padding: '15px', borderRadius: '6px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{counts.total}</div>
            <div>Total Applications</div>
          </div>
          <div style={{ flex: 1, padding: '15px', borderRadius: '6px', backgroundColor: '#e8f5e9', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{counts.accepted}</div>
            <div>Accepted</div>
          </div>
          <div style={{ flex: 1, padding: '15px', borderRadius: '6px', backgroundColor: '#ffebee', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>{counts.rejected}</div>
            <div>Rejected</div>
          </div>
          <div style={{ flex: 1, padding: '15px', borderRadius: '6px', backgroundColor: '#fff3e0', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFA500' }}>{counts.pending}</div>
            <div>Pending</div>
          </div>
        </div>
      </div>

      <FilterControls 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      <SearchBar 
        onSearch={setSearchQuery} 
        resultCount={filteredApplicants.length}
      />
      
      {filteredApplicants.length > 0 ? (
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
              <button 
                onClick={() => handleStatusChange("accepted")} 
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Accept
              </button>
              <button 
                onClick={() => handleStatusChange("rejected")}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Reject
              </button>
              <button 
                onClick={() => handleStatusChange("pending")}
                style={{
                  backgroundColor: '#FFA500',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Pending
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                      style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                Previous
              </button>
              <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, filteredApplicants.length - 1))}
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
        <p>No matching applicants found</p>
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
