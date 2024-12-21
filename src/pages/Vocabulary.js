import React, { useState, useEffect, useRef } from "react";
import { fetchCategories, fetchLearnedCategories, markCategoryAsLearned } from "../services/cardService"; // Функции для API
import { Button, Checkbox, List, ListItem, Typography, Container, Paper, Box } from "@mui/material";
import { blue, grey } from '@mui/material/colors';

const Vocabulary = () => {
  const [levels, setLevels] = useState([]); // Список уровней
  const [selectedLevels, setSelectedLevels] = useState([]); // Выбранные уровни
  const [hasLearnedLevels, setHasLearnedLevels] = useState(false); // Статус, чтобы понять, были ли получены уровни
  const timeoutRef = useRef(null); // Таймер для отслеживания задержки изменений

  // Загружаем уровни при монтировании компонента
  useEffect(() => {
    const loadLevels = async () => {
      try {
        const data = await fetchCategories(); // Запрос на сервер для получения уровней
        setLevels(data || []); // Сохраняем уровни в состоянии
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    loadLevels();
  }, []);

  // Загружаем уже изучаемые уровни
  useEffect(() => {
    const loadLearnedLevels = async () => {
      try {
        const learnedLevels = await fetchLearnedCategories(); // Запрос на сервер для получения изучаемых уровней
        // Преобразуем полученные данные в массив уровней
        const levelsArray = learnedLevels.map((item) => item.level);
        setSelectedLevels(levelsArray || []); // Устанавливаем эти уровни в состояние
        setHasLearnedLevels(true); // Устанавливаем, что уровни были загружены
      } catch (error) {
        console.error("Error fetching learned levels:", error);
      }
    };

    if (!hasLearnedLevels) {
      loadLearnedLevels(); // Запросим изучаемые уровни, если они еще не были загружены
    }
  }, [hasLearnedLevels]);

  // Функция для обработки выбора уровня
  const handleLevelToggle = (level) => {
    const isLevelSelected = selectedLevels.includes(level);

    setSelectedLevels((prevSelected) => {
      if (isLevelSelected) {
        // Если уровень уже выбран, убираем его
        return prevSelected.filter((selectedLevel) => selectedLevel !== level);
      } else {
        // Если уровень не выбран, добавляем его
        return [...prevSelected, level];
      }
    });

    // Отправляем запрос только для текущего уровня, который был изменен
    markCategoryAsLearned(level); // Отправляем на сервер только для одного уровня
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Paper sx={{ padding: 3, backgroundColor: grey[100], borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>Vocabulary Levels</Typography>
        <List>
          {levels.map((level) => (
            <ListItem key={level} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Checkbox
                checked={selectedLevels.includes(level)} // Устанавливаем галочку, если уровень выбран
                onChange={() => handleLevelToggle(level)} // Обработчик изменения уровня
                sx={{
                  color: blue[600],
                  "&.Mui-checked": {
                    color: blue[700],
                  },
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {level}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Vocabulary;
