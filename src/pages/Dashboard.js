import React, { useState, useEffect } from "react";
import Flashcards from "../components/Flashcards";
import { fetchCards } from "../services/cardService";
import { Button, Box, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { blue, green, grey } from "@mui/material/colors";
import Quiz from "../components/Quiz";
import QuizGame from "../components/QuizWebSocket";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("flashcards");
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);  // Добавляем состояние для индекса текущей карточки
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCards(20);
        setCards(data.results || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, []);

  // Функция для перехода к следующей карточке
  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1); // Увеличиваем индекс, если есть еще карточки
    } else {
      console.log("All cards have been processed.");
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "flashcards":
        return (
          <div>
            {isLoading ? (
              <CircularProgress />
            ) : cards.length > 0 ? (
              <Flashcards
                cards={cards}
                onNextCard={handleNextCard}
                currentIndex={currentIndex}  // Передаем currentIndex в компонент Flashcards
                isLearning={true}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Cards not found
              </Typography>
            )}
          </div>
        );
      case "quiz":
        return <Quiz />;
      case "quiz_game":
        return <QuizGame roomName="quiz_room" />;
      default:
        return (
          <Typography variant="h6">Выберите, чем хотите заниматься!</Typography>
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Paper sx={{ padding: 3, backgroundColor: grey[100], borderRadius: 2 }}>
        <Box sx={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setActiveComponent("flashcards")}
            sx={{
              backgroundColor: blue[600],
              color: "white",
              "&:hover": { backgroundColor: blue[700] },
              padding: "10px 20px",
              fontWeight: "bold",
              width: "200px",
            }}
          >
            Learn words
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveComponent("quiz")}
            sx={{
              backgroundColor: green[600],
              color: "white",
              "&:hover": { backgroundColor: green[700] },
              padding: "10px 20px",
              fontWeight: "bold",
              width: "200px",
            }}
          >
            Quiz
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveComponent("quiz_game")}
            sx={{
              backgroundColor: green[600],
              color: "white",
              "&:hover": { backgroundColor: green[700] },
              padding: "10px 20px",
              fontWeight: "bold",
              width: "200px",
            }}
          >
            WebSocket Quiz
          </Button>
        </Box>
        <Box>{renderComponent()}</Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
