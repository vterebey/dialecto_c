import React, { useEffect, useState } from "react";
import { fetchProfile, fetchLearnedWords } from "../services/profileService";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import Flashcards from "../components/Flashcards";  // Импортируем компонент Flashcards

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
    };

    const getLearnedWords = async () => {
      const data = await fetchLearnedWords();
      setLearnedWords(data.results);  // Устанавливаем выученные слова в состояние
    };

    //getProfile();
    getLearnedWords();
  }, []);

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % learnedWords.length;
      return nextIndex;
    });
  };

  if (!learnedWords) return <CircularProgress />;

  return (
    <Container>
      {/*<Typography variant="h4">{profile.username}</Typography>*/}
      {/*<Typography variant="body1">{profile.email}</Typography>*/}

      {/* Добавляем компонент Flashcards для отображения выученных слов */}
      <Flashcards cards={learnedWords} currentIndex={currentIndex} onNextCard={handleNextCard} />

      {/* Добавить функциональность редактирования профиля */}
      {/*<Button variant="contained" sx={{ marginTop: 2 }}>*/}
      {/*  Edit Profile*/}
      {/*</Button>*/}
    </Container>
  );
};

export default Profile;
