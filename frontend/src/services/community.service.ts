
const API_URL = 'http://localhost:8081/api';

export interface Post {
  id: number;
  user_id: number;
  author_name: string;
  title: string;
  content: string;
  topic: string;
  likes: number;
  created_at: string;
}

export const communityService = {
  getPosts: async (token?: string): Promise<Post[]> => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/community/posts`, {
        method: 'GET',
        headers
    });
    
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  createPost: async (token: string, title: string, content: string, topic: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/community/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, topic })
    });

    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  }
};
