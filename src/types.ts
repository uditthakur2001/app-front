export interface Stage {
    id: number;
    name: string;
    fileUrl: string;
    status: 'ongoing' | 'completed' | 'incomplete';
    projectId: number; 
  }
  
  export interface Project {
    projectId: number; 
    projectName: string;
    stages: Stage[]; 
  }
  
  
export interface RootState {
  download: {
    stages: Stage[]; 
  };
}
