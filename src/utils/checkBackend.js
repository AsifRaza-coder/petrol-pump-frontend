/**
 * Backend Connectivity Checker
 * 
 * This utility helps check if the backend API is accessible and deployed.
 * Use this in your browser console or as a component to test connectivity.
 */

import axios from "axios";
import { DOMAIN } from "../backend/API";

/**
 * Check if backend is accessible
 * @returns {Promise<Object>} Status object with connection details
 */
export const checkBackendStatus = async () => {
  const results = {
    domain: DOMAIN,
    accessible: false,
    status: null,
    statusText: null,
    responseTime: null,
    error: null,
    timestamp: new Date().toISOString(),
  };

  try {
    const startTime = Date.now();
    
    // Try to connect to the auth endpoint
    const response = await axios.get(`${DOMAIN}/api/auth`, {
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => status < 500, // Accept any status < 500
    });

    results.responseTime = Date.now() - startTime;
    results.status = response.status;
    results.statusText = response.statusText;
    
    // If we get any response (even 401/403), backend is accessible
    results.accessible = true;
    
    if (response.status === 401 || response.status === 403) {
      results.message = "Backend is accessible but requires authentication";
    } else if (response.status === 404) {
      results.message = "Backend is accessible but endpoint not found";
    } else {
      results.message = "Backend is accessible";
    }
    
  } catch (error) {
    results.error = error.message;
    
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      results.message = "Backend is not accessible - domain may not be deployed";
      results.errorType = "DNS/Connection Error";
    } else if (error.code === "ECONNABORTED") {
      results.message = "Backend connection timeout";
      results.errorType = "Timeout";
    } else if (error.response) {
      // We got a response, so backend exists
      results.accessible = true;
      results.status = error.response.status;
      results.statusText = error.response.statusText;
      results.message = "Backend is accessible but returned an error";
    } else {
      results.message = "Unable to connect to backend";
      results.errorType = "Network Error";
    }
  }

  return results;
};

/**
 * Log backend status to console (for debugging)
 */
export const logBackendStatus = async () => {
  console.log("🔍 Checking backend connectivity...");
  console.log(`📍 Backend URL: ${DOMAIN}`);
  
  const status = await checkBackendStatus();
  
  console.log("📊 Backend Status:", status);
  
  if (status.accessible) {
    console.log("✅ Backend is accessible!");
  } else {
    console.error("❌ Backend is not accessible!");
    console.error("Error:", status.error || status.message);
  }
  
  return status;
};

// Make it available globally for browser console
if (typeof window !== "undefined") {
  window.checkBackend = logBackendStatus;
}

