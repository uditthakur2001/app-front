import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Select,
  MenuItem,
  FormControl,
  Badge,
} from "@mui/material";
import axios from "axios";
import { Stage } from "../types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";

interface DownloadPageProps {
  projectId: number;
  projectName: string;
  stages: Stage[];
  isAdmin: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({
  projectId,
  stages: initialStages,
  isAdmin,
}) => {
  const [stages, setStages] = useState<Stage[]>(initialStages);

  const getCardColor = (status: "ongoing" | "completed" | "incomplete") => {
    switch (status) {
      case "ongoing":
        return "rgba(255, 165, 0, 0.5)"; // Orange
      case "completed":
        return "rgba(0, 128, 0, 0.5)"; // Green
      case "incomplete":
        return "rgba(128, 128, 128, 0.5)"; // Grey
      default:
        return "white";
    }
  };

  const handleStatusChange = async (
    stageId: number,
    status: "ongoing" | "completed" | "incomplete"
  ) => {
    if (!isAdmin) {
      await Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "Only admins can change the status.",
      });
      return;
    }

    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        return { ...stage, status };
      }
      return stage;
    });

    setStages(updatedStages);
    await makeApiCall(status, stageId);
  };

  const makeApiCall = async (status: "ongoing" | "completed" | "incomplete", cardId: number) => {
    await axios.put(`https://app-back-99ll.onrender.com/projects/stage/${projectId}/${cardId}`, { status });
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    if (!isAdmin) {
      await Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "Only admins can rearrange the stages.",
      });
      return;
    }

    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);

    // Call to persist the new order
    await persistOrder(reorderedStages);
  };

  const persistOrder = async (orderedStages: Stage[]) => {
    try {
      await axios.put(`https://app-back-99ll.onrender.com/reorder/${projectId}`, {
        stages: orderedStages,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Order Updated',
        text: 'The stages have been updated successfully!',
      });
    } catch (error) {
      console.error('Error updating stages:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the stages.',
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("lastPage", window.location.href);
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage) {
      window.history.replaceState(null, "", lastPage);
    }
  }, []);

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stages" direction="horizontal">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: "flex",
                overflowX: "auto",
                mt: 2,
                gap: 1,
                paddingBottom: "10px",
              }}
            >
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <Draggable draggableId={stage.id.toString()} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          width: "150px",
                        }}
                      >
                        <Box sx={{ marginTop: "50px", minWidth: "120px" }}>
                          <FormControl fullWidth>
                            <Select
                              sx={{
                                fontSize: "small",
                                width: "120px",
                                height: "25px",
                                backgroundColor: getCardColor(stage.status),
                                marginBottom: "15px",
                              }}
                              value={stage.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  stage.id,
                                  e.target.value as "ongoing" | "completed" | "incomplete"
                                )
                              }
                            >
                              <MenuItem value="ongoing">Ongoing</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="incomplete">Not Started</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Badge
                          badgeContent={index + 1}
                          color="primary"
                          sx={{ marginBottom: "5px" }}
                        >
                          <Box
                            sx={{
                              padding: "15px",
                              width: "150px",
                              height: "80px",
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              backgroundColor: getCardColor(stage.status),
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <Typography variant="body1">{stage.name}</Typography>
                          </Box>
                        </Badge>
                      </Box>
                    )}
                  </Draggable>

                  {/* Arrow connecting stages */}
                  {index < stages.length - 1 && (
                    <Typography
                      variant="h4"
                      sx={{
                        margin: "8px",
                        alignSelf: "center",
                        transform: `translateY(30px)`,
                      }}
                    >
                      &rarr;
                    </Typography>
                  )}
                </React.Fragment>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default DownloadPage;
