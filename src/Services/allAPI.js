import { BASE_URL } from "./baseURL"
import { commonAPI } from "./commonAPI"

console.log(BASE_URL)


// Register
export const registerAPI = async (user)=>{
    return await commonAPI("POST",`${BASE_URL}/user/register`,user,"")
}

// login
export const loginAPI = async (user)=>{
    return await commonAPI("POST",`${BASE_URL}/user/login`,user,"")
}

// addPost
export const addPostAPI = async (reqBody,reqHeader)=>{
    return await commonAPI("POST",`${BASE_URL}/posts/add`,reqBody,reqHeader)
}

// getAllPosts
export const allPostsAPI = async (searchKey,reqHeader)=>{
    return await commonAPI("GET",`${BASE_URL}/posts/all?search=${searchKey}`,"",reqHeader)
}

// getUserAllPosts
export const userAllPostsAPI = async (reqHeader)=>{
    return await commonAPI("GET",`${BASE_URL}/user/all-posts`,"",reqHeader)
}

// getWhoPosts
export const whoPostAPI = async (userid)=>{
    return await commonAPI("GET",`${BASE_URL}/user/${userid}`,"","")
}

// update posts
export const editPostAPI = async (postId,reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${BASE_URL}/posts/edit/${postId}`,reqBody,reqHeader)
}

// delete posts
export const deletePostAPI = async (postId,reqHeader)=>{
    return await commonAPI("DELETE",`${BASE_URL}/posts/delete/${postId}`,{},reqHeader)
}




// edit user
export const editUserProfileAPI = async (reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${BASE_URL}/user/edit`,reqBody,reqHeader)
}

// get current user info
export const getCurrentUserAPI = async (reqHeader)=>{
    return await commonAPI("GET",`${BASE_URL}/user/me`,"",reqHeader)
}

// like post 
export const postLikeAPI = async (postId,reqHeader)=>{
    return await commonAPI("POST",`${BASE_URL}/posts/like/${postId}`,{},reqHeader)
}

// unlike post 
export const postUnlikeAPI = async (postId,reqHeader)=>{
    return await commonAPI("POST",`${BASE_URL}/posts/unlike/${postId}`,{},reqHeader)
}

// Add comment to a post
export const addCommentAPI = async (postId, comment, reqHeader) => {
    return await commonAPI("POST", `${BASE_URL}/posts/${postId}/comment`, comment, reqHeader);
}
// Get all comments for a post
export const getCommentsAPI = async (postId, reqHeader) => {
    return await commonAPI("GET", `${BASE_URL}/posts/${postId}/comments`, "", reqHeader);
}
// Delete comment from a post
export const deleteCommentAPI = async (postId, commentId, reqHeader) => {
    return await commonAPI("DELETE", `${BASE_URL}/posts/${postId}/comments/${commentId}`, {}, reqHeader);
}
// Like a comment
export const likeCommentAPI = async (postId, commentId, reqHeader) => {
    return await commonAPI("POST", `${BASE_URL}/posts/${postId}/comments/${commentId}/like`, {}, reqHeader);
}
// Unlike a comment
export const unlikeCommentAPI = async (postId, commentId, reqHeader) => {
    return await commonAPI("POST", `${BASE_URL}/posts/${postId}/comments/${commentId}/unlike`, {}, reqHeader);
}

// Report a post
export const reportPostAPI = async (postId, reason, reqHeader) => {
    return await commonAPI("POST", `${BASE_URL}/posts/report`, { postId, reason }, reqHeader);
}

// Get all reports (admin)
export const getAllReportsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${BASE_URL}/admin/reports`, "", reqHeader);
}