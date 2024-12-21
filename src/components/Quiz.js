import React, { useState, useEffect } from "react";
import { fetchQuizData } from "../services/quizService"; // Service to fetch quiz data
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { blue, green, red } from '@mui/material/colors';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // Displaying result after selection
  const [correctAnswer, setCorrectAnswer] = useState(""); // Store correct answer

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const data = await fetchQuizData(); // Fetch quiz data from the server
        setQuizData(data);
        setCorrectAnswer(data.word); // Save correct answer
      } catch (error) {
        console.error("Error loading quiz data:", error);
      }
    };
    loadQuizData();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Compare the selected option with the correct word
    const correct = option === quizData.word;
    setIsCorrect(correct);
  };

  const handleNextQuestion = () => {
    setSelectedOption("");
    setIsCorrect(null);
    setQuizData(null); // Clear previous data before loading new question
    setCorrectAnswer(""); // Reset correct answer
    // Load next quiz data
    const loadNextQuizData = async () => {
      try {
        const data = await fetchQuizData();
        setQuizData(data);
        setCorrectAnswer(data.word);
      } catch (error) {
        console.error("Error loading next quiz data:", error);
      }
    };
    loadNextQuizData();
  };

  if (!quizData) {
    return <p>  </p>;
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
        ':hover': { boxShadow: 6 },
        padding: 2
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", fontSize: 28, color: blue[700], marginBottom: 3 }}
        >
          {quizData.correct_definition}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
          {/* Left side buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "48%" }}>
            {quizData.options.slice(0, 2).map((option, index) => (
              <Button
                key={index}
                onClick={() => handleOptionSelect(option)}
                variant="contained"
                fullWidth
                sx={{
                  margin: "10px 0",
                  backgroundColor:
                    selectedOption === option
                      ? isCorrect === null
                        ? "#e0e0e0"
                        : isCorrect
                        ? green[600]
                        : red[600]
                      : blue[500],
                  color: "white",
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor:
                      selectedOption === option
                        ? isCorrect === null
                          ? "#cfcfcf"
                          : isCorrect
                          ? green[700]
                          : red[700]
                        : blue[600],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {option}
              </Button>
            ))}
          </Box>

          {/* Right side buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "48%" }}>
            {quizData.options.slice(2).map((option, index) => (
              <Button
                key={index + 2}
                onClick={() => handleOptionSelect(option)}
                variant="contained"
                fullWidth
                sx={{
                  margin: "10px 0",
                  backgroundColor:
                    selectedOption === option
                      ? isCorrect === null
                        ? "#e0e0e0"
                        : isCorrect
                        ? green[600]
                        : red[600]
                      : blue[500],
                  color: "white",
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor:
                      selectedOption === option
                        ? isCorrect === null
                          ? "#cfcfcf"
                          : isCorrect
                          ? green[700]
                          : red[700]
                        : blue[600],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>

        {isCorrect !== null && (
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

        <Button
          onClick={handleNextQuestion}
          variant="contained"
          sx={{
            backgroundColor: blue[600],
            color: "white",
            width: "100%",
            marginTop: 3,
            '&:hover': {
              backgroundColor: blue[700],
            },
          }}
        >
          Next Question
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quiz;
