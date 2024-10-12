import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Download {
  id: number;
  name: string;
  description: string;
  fileUrl: string;
}

interface Stage {
  id: number;
  name: string;
  fileUrl: string;
  status: 'ongoing' | 'completed' | 'incomplete'; 
  projectId?: number; 
}

interface DownloadsState {
  downloads: Download[];
  stages: Stage[];
}

const initialState: DownloadsState = {
  downloads: [],
  stages: [], 
};

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    setDownloads: (state, action: PayloadAction<Download[]>) => {
      state.downloads = action.payload;
    },
    setStages: (state, action: PayloadAction<Stage[]>) => {
      state.stages = action.payload; 
    },
    updateStageStatus(state, action: PayloadAction<Stage[]>) {
      state.stages = action.payload; 
    },
  },
});

export const { setDownloads, setStages, updateStageStatus } = downloadsSlice.actions;
export default downloadsSlice.reducer;
