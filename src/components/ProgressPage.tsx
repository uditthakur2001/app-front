import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DownloadPage from "./DownloadPage";
import { Project } from "../types";
import FilePage from './FilePage'; 

const ProgressPage: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://app-back-99ll.onrender.com/projects");
        const projectsData = response.data;

        const combinedProjects = projectsData.map((project: Project) => ({
          ...project,
          stages: project.stages || [],
        }));

        setProjects(combinedProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewStages = (project: Project) => {
    setSelectedProject(null);
    setTimeout(() => {
      setSelectedProject(project);
    }, 0);
  };

  return (
    <Box style={{ padding: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Dropdown Menu for Projects */}
      Select Project
      {projects.length === 0 ? (
        <Typography fontSize={'22px'} fontWeight={'600'} marginBottom={'-20px'} color="textSecondary">
          No projects available
        </Typography>
      ) : (
        <FormControl 
          sx={{
            width: '200px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '0px',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'rgba(72, 194, 195, .5)',
              color: 'white',
            },
          }} 
          size="small" 
          margin="normal"
        >
          <InputLabel 
            sx={{
              position: 'absolute',
              top: '-8px',
              left: '10px',
              padding: '0 5px',
              fontSize: '14px',
            }}
          >
            {/* Select Project */}
          </InputLabel>
          <Select
            value={selectedProject?.projectId || ""}
            onChange={(e) => {
              const projectId = e.target.value;
              const selected = projects.find((project) => project.projectId === projectId);
              if (selected) handleViewStages(selected);
            }}
            displayEmpty
          >
            {projects.map((project) => (
              <MenuItem key={project.projectId} value={project.projectId}>
                {project.projectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedProject && (
        <Box mt={5} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Project Stages for {selectedProject.projectName}
          </Typography>
          <DownloadPage
            projectId={selectedProject.projectId}
            projectName={selectedProject.projectName}
            stages={selectedProject.stages}
            isAdmin={isAdmin}
          />
        </Box>
      )}

      {!selectedProject && (
        <Box mt={5}>
          <FilePage />
        </Box>
      )}
    </Box>
  );
};

export default ProgressPage;
