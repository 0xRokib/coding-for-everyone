const API_URL = 'http://localhost:8081/api';

export interface Course {
  id: number;
  persona: string;
  goals: string;
  curriculum?: any;
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
  },

  async createCourse(data: { persona: string; goals: string }, token: string): Promise<Course> {
    const response = await fetch(`${API_URL}/lesson-plan`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create course');
    }
    
    return response.json();
  },

  async deleteCourse(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/courses?id=${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
  }
};
