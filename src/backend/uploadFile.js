import axios from "axios"
import { DOMAIN } from "./API"
import LocalStorage from "../helpers/LocalStorage"

//creating file upload end point
export const FileUpload = async (file) => {
    try {
        // Get token from localStorage
        const token = LocalStorage.getToken();
        
        // Create axios config with headers
        // Don't set Content-Type for FormData - let axios set it with boundary
        const config = {
            headers: {
                'x-auth-token': token || ''
            },
            timeout: 30000, // 30 seconds timeout
            onUploadProgress: (progressEvent) => {
                // Optional: You can add progress tracking here
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload progress: ${percentCompleted}%`);
            }
        };
        
        const response = await axios.post(`${DOMAIN}/api/uploads`, file, config);
        return response.data;
    } catch (error) {
        //Return Error to New Packages Component
        console.error("File upload error:", error);
        return error.response?.data || { success: false, msg: "Upload failed" }
    }
}