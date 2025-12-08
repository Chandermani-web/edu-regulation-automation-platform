import axios from 'axios';
import FormData from 'form-data';

/**
 * Service to communicate with Python verification server
 * Supports both ngrok URL and local fallback
 */
class PythonVerificationService {
    constructor() {
        // Primary URL (ngrok) - should be set via environment variable
        this.primaryUrl = process.env.PYTHON_SERVER_URL || null;
        
        // Fallback to local server
        this.fallbackUrl = process.env.PYTHON_LOCAL_URL || 'http://127.0.0.1:5000';
        
        // Timeout for requests (30 seconds)
        this.timeout = 30000;
    }

    /**
     * Get the active Python server URL
     * @returns {string} The server URL to use
     */
    getServerUrl() {
        return this.primaryUrl || this.fallbackUrl;
    }

    /**
     * Check if Python server is healthy
     * @returns {Promise<boolean>}
     */
    async checkHealth() {
        try {
            const url = this.getServerUrl();
            const response = await axios.get(`${url}/health`, {
                timeout: 5000
            });
            return response.data.status === 'healthy' || response.status === 200;
        } catch (error) {
            console.error('Python server health check failed:', error.message);
            return false;
        }
    }

    /**
     * Send PDF URL to Python server for verification
     * @param {string} pdfUrl - The URL of the PDF to verify
     * @returns {Promise<Object>} Verification results
     */
    async verifyPdfFromUrl(pdfUrl) {
        if (!pdfUrl) {
            throw new Error('PDF URL is required');
        }

        let lastError = null;
        const urls = this.primaryUrl ? [this.primaryUrl, this.fallbackUrl] : [this.fallbackUrl];

        // Try primary URL first, then fallback
        for (const serverUrl of urls) {
            try {
                // console.log(`Attempting to send PDF to Python server: ${serverUrl}`);
                
                const response = await axios.post(
                    `${serverUrl}/api/verify-pdf`,
                    { pdfUrl },
                    {
                        timeout: this.timeout,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`Response from server ${serverUrl}:`, response.data);

                if (response.data.success) {
                    console.log('PDF verification successful');
                    return {
                        success: true,
                        data: response.data.data,
                        serverUsed: serverUrl
                    };
                } else {
                    throw new Error(response.data.error || 'Verification failed');
                }
            } catch (error) {
                lastError = error;
                console.error(`Failed to connect to Python server at ${serverUrl}:`, error.message);
                
                // If this is not the last URL, continue to next one
                if (serverUrl !== urls[urls.length - 1]) {
                    console.log('Trying fallback server...');
                    continue;
                }
            }
        }

        // If all attempts failed, throw the last error
        throw new Error(
            `Failed to connect to Python verification server. ` +
            `Last error: ${lastError?.response?.data?.error || lastError?.message || 'Unknown error'}. ` +
            `Make sure the Python server is running.`
        );
    }

    
    /**
     * Send PDF file buffer to Python server for verification
     * @param {Buffer} fileBuffer - The PDF file buffer
     * @param {string} filename - Original filename
     * @returns {Promise<Object>} Verification results
     */
    async verifyPdfFromFile(fileBuffer, filename) {
        if (!fileBuffer) {
            throw new Error('PDF file buffer is required');
        }

        let lastError = null;
        const urls = this.primaryUrl ? [this.primaryUrl, this.fallbackUrl] : [this.fallbackUrl];

        // Try primary URL first, then fallback
        for (const serverUrl of urls) {
            try {
                console.log(`Attempting to send PDF file to Python server: ${serverUrl}`);
                
                const formData = new FormData();
                formData.append('file', fileBuffer, filename);

                const response = await axios.post(
                    `${serverUrl}/api/verify-pdf-file`,
                    formData,
                    {
                        timeout: this.timeout,
                        headers: {
                            ...formData.getHeaders()
                        }
                    }
                );

                if (response.data.success) {
                    console.log('PDF verification successful');
                    return {
                        success: true,
                        data: response.data.data,
                        serverUsed: serverUrl
                    };
                } else {
                    throw new Error(response.data.error || 'Verification failed');
                }
            } catch (error) {
                lastError = error;
                console.error(`Failed to connect to Python server at ${serverUrl}:`, error.message);
                
                // If this is not the last URL, continue to next one
                if (serverUrl !== urls[urls.length - 1]) {
                    console.log('Trying fallback server...');
                    continue;
                }
            }
        }

        // If all attempts failed, throw the last error
        throw new Error(
            `Failed to connect to Python verification server. ` +
            `Last error: ${lastError?.response?.data?.error || lastError?.message || 'Unknown error'}. ` +
            `Make sure the Python server is running.`
        );
    }
}

// Export singleton instance
export default new PythonVerificationService();
