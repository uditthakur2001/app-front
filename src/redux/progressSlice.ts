import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Stage {
  id: number;
  name: string;
  description: string;
  fileUrl: string;
}

interface Project {
  projectId: number;
  projectName: string;
  stages: Stage[];
}


interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addStage: (state, action: PayloadAction<{ projectId: number; stage: Stage }>) => {
      const { projectId, stage } = action.payload;
      const project = state.projects.find((p) => p.projectId === projectId);
      if (project) {
        project.stages.push(stage);
      }
    },
  },
});

export const { setProjects, addStage } = projectsSlice.actions;
export default projectsSlice.reducer;
