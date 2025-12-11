const API_URL = 'http://localhost:8081/api';

export interface Course {
  id: number;
  persona: string;
  goals: string;
  createdAt: string;
}

export const courseService = {
  async getMyCourses(token: string): Promise<Course[]> {
    const response = await fetch(`${API_URL}/courses`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  }
};
