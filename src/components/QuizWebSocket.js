import React, { useState, useEffect } from "react";
import { QuizWebSocket } from "../services/quizWebsocketService";
import { Card, CardContent, Typography, Button, Box, Grid } from "@mui/material";
import { blue, green, red, grey } from "@mui/material/colors";

const QuizGame = ({ roomName }) => {
  const [quizData, setQuizData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [disableOptions, setDisableOptions] = useState(false);
  const [message, setMessage] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);

  const GAME_TIME = 10; // Время игры в секундах
  const [timeRemaining, setTimeRemaining] = useState(GAME_TIME);

  useEffect(() => {
    const handleQuestion = (data) => {
      console.log("Received question:", data);
      setQuizData(data);
      setMessage(null);
      setSelectedOption("");
      setCorrectAnswer(null);
      setIsCorrect(null);
      setDisableOptions(false); // Разрешаем выбор нового ответа
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeRemaining(GAME_TIME); // Сброс времени игры

      // Показываем правильный ответ за 2 секунды до конца времени
      const showCorrectAnswerTimeout = setTimeout(() => {
        setCorrectAnswer(data.data.word); // Устанавливаем правильный ответ
        setDisableOptions(true); // Блокируем выбор вариантов
        if (selectedOption !== "") {
          const correct = selectedOption === data.data.word;
          setIsCorrect(correct); // Показываем правильность ответа
        }
      }, (GAME_TIME - 2) * 1000);

      return () => clearTimeout(showCorrectAnswerTimeout);
    };

    const handleEndGame = (endMessage) => {
      console.log("Game ended:", endMessage);
      setMessage(endMessage);
      setQuizData(null);
      setGameEnded(true);
    };

    QuizWebSocket.connect(roomName, handleQuestion, handleEndGame);

    return () => {
      //QuizWebSocket.disconnect();
    };
  }, [roomName, selectedOption]);

  useEffect(() => {
    // Таймер для отсчета времени
    if (timeRemaining > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, gameEnded]);

  const handleOptionSelect = (option) => {
    if (!disableOptions) {
      setSelectedOption(option);
      const correct = option === quizData.data.word;
      setIsCorrect(correct);

      // Если ответ правильный, увеличиваем счет
      if (correct) {
        setScore((prevScore) => prevScore + 1);
      }

      // Отправляем выбор пользователя
      QuizWebSocket.send("answer", {
          question_index: questionIndex,
          selected_option: option
      });

      // Блокируем ответы после выбора
      setDisableOptions(true);
    }
  };

  const renderOptions = () => {
    if (!quizData || !quizData.data.options) {
      return <Typography variant="body1">Loading options...</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {quizData.data.options.map((option, index) => (
          <Grid item xs={6} key={index}>
            <Button
              onClick={() => handleOptionSelect(option)}
              variant="contained"
              fullWidth
              sx={{
                margin: "10px 0",
                backgroundColor:
                  selectedOption === option
                    ? grey[400] // Визуально выделяем выбранный пользователем ответ
                    : correctAnswer === option
                    ? green[600] // Подсвечиваем правильный ответ за 2 секунды до конца
                    : blue[500],
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor:
                    selectedOption === option
                      ? grey[500]
                      : correctAnswer === option
                      ? green[700]
                      : blue[600],
                },
                transition: "all 0.3s ease",
              }}
              disabled={disableOptions}
            >
              {option}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (gameEnded) {
    return (
      <Card
        sx={{
          maxWidth: 600,
          margin: "20px auto",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#f3f4f6",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: blue[700], textAlign: "center" }}
          >
            Game Over!
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: green[700], textAlign: "center" }}
          >
            {message || "Thanks for playing!"}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: blue[700], textAlign: "center", marginTop: 2 }}
          >
            Your Score: {score} {/* Отображаем результат игры */}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!quizData) {
    return <p>Waiting for the question...</p>;
  }

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#f3f4f6",
        transition: "all 0.3s ease-in-out",
        ":hover": { boxShadow: 6 },
        padding: 2,
      }}
    >
      <CardContent>
        {/* Определение */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: "bold",
            fontSize: 24,
            color: blue[700],
            marginBottom: 3,
          }}
        >
          {quizData.data.correct_definition}
        </Typography>

        <Box>{renderOptions()}</Box>

        {timeRemaining <= 2 && isCorrect !== null && (
          <Typography
            variant="body1"
            sx={{
              color: isCorrect ? green[600] : red[600],
              fontWeight: "bold",
              marginTop: 2,
            }}
          >
            {isCorrect ? "Correct! 🎉" : "Incorrect. 😞"}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: blue[500],
            textAlign: "center",
            marginTop: 3,
          }}
        >
          Time Left: {timeRemaining}s
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuizGame;
