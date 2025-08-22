import React, { useEffect, useState } from 'react';
import { getAllReportsAPI } from '../Services/allAPI';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const reqHeader = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const result = await getAllReportsAPI(reqHeader);
        if (result.status === 200) {
          setReports(result.data);
        } else {
          setReports([]);
        }
      } catch (err) {
        setReports([]);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <div className="admin-hero">
          <div className="container">
            <div className="admin-header">
              <h1>🍽️ Admin Dashboard</h1>
              <p>Manage and monitor recipe reports</p>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{reports.length}</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>{reports.filter(r => !r.resolved).length}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{reports.filter(r => r.resolved).length}</h3>
                <p>Resolved</p>
              </div>
            </div>
          </div>

          <div className="reports-section">
            <div className="section-header">
              <h2>🚨 Reported Posts</h2>
              <p>Review and take action on reported content</p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">🍳</div>
                <p>Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="no-reports">
                <div className="no-reports-icon">🎉</div>
                <h3>No Reports Found</h3>
                <p>All posts are following community guidelines!</p>
              </div>
            ) : (
              <div className="reports-grid">
                {reports.map((report) => (
                  <div key={report._id} className="report-card">
                    <div className="report-header">
                      <div className="report-icon">🚨</div>
                      <div className="report-meta">
                        <span className="report-date">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span className="report-time">
                          {new Date(report.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="report-content">
                      <div className="report-info">
                        <p><strong>Post:</strong> {report.postId?.recipename || 'Post not found'}</p>
                        <p><strong>Reported By:</strong> {report.reportedBy?.username || 'Unknown user'}</p>
                        <p><strong>Reason:</strong> {report.reason}</p>
                      </div>
                    </div>
                    <div className="report-actions">
                      <button className="btn btn-warning btn-sm">Review</button>
                      <button className="btn btn-danger btn-sm">Remove Post</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard; 