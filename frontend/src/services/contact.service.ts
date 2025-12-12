const API_URL = 'http://localhost:8081/api';

export const contactService = {
  submit: async (data: { firstName: string; lastName: string; email: string; message: string }) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            message: data.message
        })
    });
    
    if (!response.ok) throw new Error('Failed to submit contact form');
    return response.json();
  }
};
