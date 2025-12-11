const API_URL = 'http://localhost:8081/api';

export interface RoadmapData {
    found: boolean;
    data?: {
        plan_id: number;
        content: {
            title: string;
            description: string;
            lessons: Array<{
                id: string;
                title: string;
                content: string;
            }>;
        }; // Content is JSON with 'lessons' array
        current_index: number;
    }
}

export const roadmapService = {
  getRoadmap: async (token: string): Promise<RoadmapData> => {
    const response = await fetch(`${API_URL}/roadmap`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch roadmap');
    return response.json();
  },

  updateProgress: async (token: string, planID: number, index: number) => {
      await fetch(`${API_URL}/roadmap/progress`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ plan_id: planID, index })
      });
  }
};
