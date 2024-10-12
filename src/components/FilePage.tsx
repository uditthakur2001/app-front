import React, { useEffect, useState } from "react";
import {Container, Typography, Box, Card, CardContent, Button, CircularProgress} from "@mui/material";

interface FileItem {
  id: number;
  name: string;
  description: string;
  fileUrl?: string; 
  url?: string;
}

const FilePage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://app-back-99ll.onrender.com/downloads");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading files...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Download Documents
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={4} 
      >
        {files.map((item) => (
          <Box
            key={item.id} 
            sx={{ width: "150px",height: "150px"  }} 
          >
            <Card
              sx={{
                marginTop: 5,
                boxShadow: 5,
                borderRadius: 2,
                height: "100px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
              <Button
                  size="small"
                  color="primary"
                  component="a"
                  href={item.fileUrl || item.url}
                  download={item.name} 
                >
                  
                <Typography >{item.name}</Typography>
                </Button>
              </CardContent>
                
               
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default FilePage;
