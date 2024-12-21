import React, { useEffect, useState } from "react";
import { fetchProfile, fetchLearnedWords, fetchWordsCount } from "../services/profileService";
import { Container, Typography, CircularProgress, Box, LinearProgress } from "@mui/material";
import Flashcards from "../components/Flashcards"; // Импортируем компонент Flashcards

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [learnedWords, setLearnedWords] = useState([]);
  const [totalWordsCount, setTotalWordsCount] = useState(0); // Для хранения общего количества слов
  const [currentIndex, setCurrentIndex] = useState(0);  // Состояние для текущего индекса карточки

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);  // Устанавливаем профиль, включая score
    };

    const getLearnedWords = async () => {
      const data = await fetchLearnedWords();
      setLearnedWords(data.results);  // Устанавливаем выученные слова в состояние
    };

    const getWordsCount = async () => {
      const data = await fetchWordsCount();  // Получаем только количество слов
      setTotalWordsCount(data);  // Устанавливаем количество всех слов
    };

    getProfile();
    getLearnedWords();
    getWordsCount();
  }, []);

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => {
      // Проверяем, есть ли еще карточки
      if (prevIndex + 1 < learnedWords.length) {
        return prevIndex + 1;  // Если есть, увеличиваем индекс
      }
      return prevIndex;  // Если карточек больше нет, возвращаем текущий индекс (не меняем)
    });
  };

  // Рассчитываем прогресс
  const progressPercentage = totalWordsCount === 0 ? 0 : Math.round((learnedWords.length / totalWordsCount) * 100);

  return (
    <Container sx={{ paddingTop: 4 }}>  {/* Добавляем отступ сверху */}
      {/* Статистика */}
      <Box sx={{ marginBottom: 4, padding: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
          Your Progress
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Learned words: <strong>{learnedWords.length}</strong> / <strong>{totalWordsCount}</strong>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ marginBottom: 2, borderRadius: 1 }}
        />
        <Typography variant="body2" color="textSecondary">
          {progressPercentage}% of total words learned
        </Typography>

        {/* Добавляем отображение score */}
        {profile && (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Score: <strong>{profile.score}</strong> {/* Отображаем значение score */}
          </Typography>
        )}
      </Box>

      {/* Добавляем компонент Flashcards для отображения выученных слов */}
      {learnedWords.length > 0 ? (
        <Flashcards
          cards={learnedWords}
          currentIndex={currentIndex}  // Передаем текущий индекс карточки
          onNextCard={handleNextCard}  // Передаем handleNextCard для смены карточки
          isLearning={false}
        />
      ) : (
        <CircularProgress />  // Показываем загрузку, если нет выученных слов
      )}
    </Container>
  );
};

export default Profile;
