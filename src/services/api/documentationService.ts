
import apiClient from '@/utils/apiUtils';

/**
 * Service for fetching documentation-related data from the API
 */
const documentationService = {
  /**
   * Get API schema and endpoints documentation
   * @returns API documentation details
   */
  getApiDocs: async () => {
    try {
      const response = await apiClient.get('/api/documentation');
      return response.data;
    } catch (error) {
      console.error('Error fetching API documentation:', error);
      throw error;
    }
  },

  /**
   * Get database schema documentation
   * @returns Database schema details
   */
  getDatabaseDocs: async () => {
    try {
      const response = await apiClient.get('/api/documentation/database');
      return response.data;
    } catch (error) {
      console.error('Error fetching database documentation:', error);
      throw error;
    }
  },

  /**
   * Get examples and code snippets for API usage
   * @returns API usage examples
   */
  getApiExamples: async () => {
    try {
      const response = await apiClient.get('/api/documentation/examples');
      return response.data;
    } catch (error) {
      console.error('Error fetching API examples:', error);
      throw error;
    }
  },

  /**
   * Get frontend documentation
   * @returns Frontend documentation content
   */
  getFrontendDocs: async () => {
    try {
      const response = await apiClient.get('/api/documentation/frontend');
      return response.data;
    } catch (error) {
      console.error('Error fetching frontend documentation:', error);
      // We'll load from local files as fallback
      return { content: '' };
    }
  },

  /**
   * Get backend documentation
   * @returns Backend documentation content
   */
  getBackendDocs: async () => {
    try {
      const response = await apiClient.get('/api/documentation/backend');
      return response.data;
    } catch (error) {
      console.error('Error fetching backend documentation:', error);
      // We'll load from local files as fallback
      return { content: '' };
    }
  },

  /**
   * Get AI features documentation
   * @returns AI documentation content
   */
  getAIDocs: async () => {
    try {
      const response = await apiClient.get('/api/documentation/ai-features');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI documentation:', error);
      // We'll load from local files as fallback
      return { content: '' };
    }
  }
};

export default documentationService;
