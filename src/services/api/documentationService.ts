
import axios from 'axios';
import { API_URL } from '@/config/config';

// Define the documentation content type
interface DocumentationContent {
  content: string;
  lastUpdated?: string;
}

// Get frontend documentation
const getFrontendDocs = async (): Promise<DocumentationContent> => {
  try {
    const response = await axios.get(`${API_URL}/documentation/frontend`);
    return response.data;
  } catch (error) {
    console.error('Error fetching frontend documentation:', error);
    return { content: '' };
  }
};

// Get backend documentation
const getBackendDocs = async (): Promise<DocumentationContent> => {
  try {
    const response = await axios.get(`${API_URL}/documentation/backend`);
    return response.data;
  } catch (error) {
    console.error('Error fetching backend documentation:', error);
    return { content: '' };
  }
};

// Get AI documentation
const getAIDocs = async (): Promise<DocumentationContent> => {
  try {
    const response = await axios.get(`${API_URL}/documentation/ai`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI documentation:', error);
    return { content: '' };
  }
};

export {
  getFrontendDocs,
  getBackendDocs,
  getAIDocs
};
