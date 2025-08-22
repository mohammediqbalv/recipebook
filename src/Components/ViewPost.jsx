import React, { useContext, useEffect } from "react";
import { Avatar } from "@mui/material";
import avatar from "../Assets/user.jpg";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Dropdown from "react-bootstrap/Dropdown";
import EditPost from "./EditPost";
import { BASE_URL } from "../Services/baseURL";
import {
  deletePostAPI,
  postLikeAPI,
  postUnlikeAPI,
  whoPostAPI,
  addCommentAPI,
  getCommentsAPI,
  deleteCommentAPI,
  likeCommentAPI,
  unlikeCommentAPI,
  reportPostAPI,
  getCurrentUserAPI,
} from "../Services/allAPI";
import {
  addPostResponseContext,
  deletePostResponseContext,
} from "../Contexts/ContextShare";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewPost({ iseditAndDeleteBtn, post }) {
  const [open, setOpen] = useState(false);
  const [showReportBanner, setShowReportBanner] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
  // Handle report click - show modal
  const handleReport = () => {
    setShowReportModal(true);
  };

  // Submit report with custom reason
  const submitReport = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      
      console.log("Reporting post:", post._id);
      console.log("Report reason:", reportReason);
      
      const result = await reportPostAPI(post._id, reportReason || "Inappropriate content", reqHeader);
      
      console.log("Report result:", result);
      
      if (result.status === 200) {
        setShowReportModal(false);
        setReportReason('');
        setShowReportBanner(true);
        toast.success("Post reported successfully!");
        setTimeout(() => {
          setShowReportBanner(false);
        }, 3000);
      } else {
        console.log("Report failed:", result.response);
        toast.error(result.response?.data?.message || "Failed to report post");
      }
    } catch (err) {
      console.log("Report error:", err);
      toast.error("Failed to report post");
    }
  };

  // Close report modal
  const closeReportModal = () => {
    setShowReportModal(false);
    setReportReason('');
  };

  // console.log(post);

  const { deleteResponse, setDeleteResponse } = useContext(
    deletePostResponseContext
  );
  // const {addPostResponse,setAddPostResponse} = useContext(addPostResponseContext)

  const [whoPost, setWhoPost] = useState(null);

  const [userLiked, setUserLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getWhoUser = async () => {
    if (post.userId) {
      const userId = post.userId;
      const result = await whoPostAPI(userId);
      if (result.status === 200) {
        setWhoPost(result.data);
      } else {
        console.log(result);
      }
    }
  };

  const getCurrentUserInfo = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      try {
        const result = await getCurrentUserAPI(reqHeader);
        if (result.status === 200) {
          setCurrentUser(result.data);
        }
      } catch (err) {
        console.log("Failed to get current user info:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const result = await deletePostAPI(id, reqHeader);
    if (result.status === 200) {
      // page reloaded
      toast.success("Delete Post..");
      setDeleteResponse(result.data);
    } else {
      toast.error(result.response.data);
    }
  };

  // Like post
  const likePost = async (id) => {
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const result = await postLikeAPI(id, reqHeader);
    if (result.status === 200) {
      // page reloaded
      setDeleteResponse(result.data);
    } else {
      toast.error(result.response.data);
    }
  };

  const unlikePost = async (id) => {
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const result = await postUnlikeAPI(id, reqHeader);
    if (result.status === 200) {
      // page reloaded
      setDeleteResponse(result.data);

    } else {
      toast.error(result.response.data);
    }
  };

  // Fetch comments for this post
  const fetchComments = async () => {
    setLoadingComments(true);
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const result = await getCommentsAPI(post._id, reqHeader);
    if (result.status === 200) {
      setComments(result.data);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    getWhoUser();
    fetchComments();
    getCurrentUserInfo();
    // eslint-disable-next-line
  }, [post._id]);

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const user = JSON.parse(sessionStorage.getItem("existingUser"));
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const commentData = {
      text: newComment,
      userId: user._id,
      username: user.username,
    };
    const result = await addCommentAPI(post._id, commentData, reqHeader);
    if (result.status === 200) {
      setComments(result.data);
      setNewComment("");
      toast.success("Comment added!");
    } else {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    // Check if the current user ID is in the likes array
    const user = currentUser || JSON.parse(sessionStorage.getItem("existingUser"));
    if (user) {
      setUserLiked(post.likes?.includes(user._id));
    }
  }, [post.likes, post.userId, currentUser]);

  const handleDeleteComment = async (commentId) => {
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const result = await deleteCommentAPI(post._id, commentId, reqHeader);
    if (result.status === 200) {
      setComments(result.data.comments || result.data);
      toast.success("Comment deleted!");
    } else {
      toast.error(result.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    let result;
    if (liked) {
      result = await unlikeCommentAPI(post._id, commentId, reqHeader);
    } else {
      result = await likeCommentAPI(post._id, commentId, reqHeader);
    }
    if (result.status === 200) {
      // Update the specific comment in the comments array
      setComments(prevComments => prevComments.map(c => c._id === result.data._id ? result.data : c));
    } else {
      toast.error("Failed to update like");
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#f2f2f2" }}
        className="border rounded p-3 mt-2 position-relative"
      >
        {showReportBanner && (
          <div className="alert alert-warning alert-dismissible fade show position-absolute w-100 top-0 start-0" role="alert" style={{zIndex: 10}}>
            <strong>Reported!</strong> This post has been reported. Thank you for your feedback.
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowReportBanner(false)}></button>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center me-5 ">
            <div>
              <Avatar
                alt="Remy Sharp"
                className="img-fluid border"
                src={
                  whoPost?.profile === ""
                    ? avatar
                    : `${BASE_URL}/uploads/${whoPost?.profile}`
                }
                sx={{ width: 34, height: 34 }}
              />
            </div>
            <div className="ms-3 d-flex flex-column">
              <span style={{ fontSize: "14px" }} className="fw-bold">
                {whoPost?.username}
              </span>
              <span style={{ fontSize: "9px" }} className="">
                {whoPost?.email}
              </span>
            </div>
          </div>
          {/* edit delete */}
          {iseditAndDeleteBtn ? (
            <div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-basic"
                  className="border-0"
                >
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#/action-3"
                    style={{ fontSize: "12px" }}
                    className="p-2"
                  >
                    <EditPost post={post} />
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDelete(post._id)}
                    href="#/action-3"
                    style={{ fontSize: "12px" }}
                    className="p-2"
                  >
                    <i class="fa-solid fa-trash"></i> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-basic"
                  className="border-0"
                >
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#/action-3"
                    style={{ fontSize: "12px" }}
                    className="p-2 text-danger"
                    onClick={handleReport}
                  >
                    Report
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-3"
                    style={{ fontSize: "12px" }}
                    className="p-2"
                  >
                    cancel
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>

        <div className="px-0">
          <div className="mt-2  ">
            <div style={{ fontFamily: "'Play', sans-serif" }}>
              {post.recipename}
              <Button
                className="border-0 text-dark"
                style={{ backgroundColor: "#f2f2f2" }}
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
              >
                <i class="fa-solid fa-angle-down"></i>
              </Button>{" "}
            </div>
            <Collapse in={open}>
              <div id="example-collapse-text">
                <Form>
                  <Form.Group>
                    <Form.Control
                      className="bg-transparent border-0"
                      as="textarea"
                      value={post.make}
                      rows={10}
                      style={{ resize: "none", fontSize: "13px" }}
                    />
                  </Form.Group>
                </Form>
              </div>
            </Collapse>
          </div>
          <div className=" mt-2 rounded d-flex justify-content-center align-items-center">
            {post.recipeVideo ? (
              <video
                style={{ height: "200px", width: "100%" }}
                className="img-fluid rounded-4 border border-2"
                src={`${BASE_URL}/uploads/${post.recipeVideo}`}
                controls
              />
            ) : (
              <img
                className="rounded-4 border border-2"
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
                src={post ? `${BASE_URL}/uploads/${post.recipeImage}` : avatar}
                alt="Loading"
              />
            )}
          </div>
        </div>
        <hr className="p-0" />
        <div className="d-flex justify-content-around p-0">
          {userLiked ? (
            <div className="fs-5">
              <i style={{cursor:"pointer"}} onClick={() => unlikePost(post._id)} class="fa-solid fa-heart text-danger">
              </i>
            </div>
          ) : (
           <div className="fs-5">
              <i style={{cursor:"pointer"}} onClick={() => likePost(post._id)} class="fa-regular fa-heart">
              </i>  
           </div>
          )}
          <div className="fs-5">😋 { post?.likes?.length > 0 && post?.likes?.length } </div>
          {/* <i class="fa-regular fa-comment "></i> */}
        </div>
        {/* Comment Section */}
        <div className="comment-section">
          <h6>Comments ({comments.length})</h6>
          {loadingComments ? (
            <div>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-muted">No comments yet.</div>
          ) : (
            <>
              <ul className="comment-list">
                {(showAllComments ? comments : comments.slice(0, 3)).map((comment, idx) => {
                  const user = currentUser || JSON.parse(sessionStorage.getItem("existingUser"));
                  const liked = user && comment.likes && comment.likes.includes(user._id);
                  const canDeleteComment = user && (comment.userId === user._id || user.isAdmin);
                  return (
                    <li key={comment._id || idx} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-timestamp">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="comment-body">{comment.text}</div>
                        <div className="d-flex align-items-center gap-2">
                          {canDeleteComment && (
                            <button
                              className="comment-delete-btn ms-2"
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Delete comment"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm"
                            style={{ color: liked ? '#ff9800' : '#bdbdbd' }}
                            onClick={() => handleLikeComment(comment._id, liked)}
                            title={liked ? "Unlike" : "Like"}
                          >
                            <i className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                            <span style={{ marginLeft: 4 }}>{comment.likes ? comment.likes.length : 0}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {comments.length > 3 && (
                <div className="text-center mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? 'Show Less' : `View All ${comments.length} Comments`}
                  </button>
                </div>
              )}
            </>
          )}
          <form onSubmit={handleAddComment} className="comment-input-form">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h4 style={{ marginBottom: '1rem', color: '#ff6b35' }}>🚨 Report Post</h4>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              Please provide a reason for reporting this post:
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter the reason for reporting this post..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                resize: 'vertical',
                marginBottom: '1rem',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeReportModal}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewPost;
