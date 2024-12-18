import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import WordCard from "./WordCard";  // Импорт компонента WordCard
import {markAsLearned} from "../services/cardService"

const Flashcards = ({ cards = [], currentIndex, onNextCard }) => {
  if (cards.length === 0) {
    return <Typography variant="h6"></Typography>;
  }

  const handleMarkAsLearned = (index, wordId) => {
    console.log(`Word at index ${index} is marked as learned.`);
    markAsLearned(wordId);
    const realIndex = cards.findIndex(card => card.id === wordId);
    if (realIndex !== -1) {
      cards.splice(realIndex, 1);
    }
  };

  return (
    <div>
      {/* Отображаем текущую карточку, передавая её индекс */}
      <WordCard
        id={cards[currentIndex].id}
        word={cards[currentIndex].word}
        audio_pronciations={cards[currentIndex].audio_pronciations}
        definitions={cards[currentIndex].definitions}
        currentIndex={currentIndex} // Передаем индекс карточки
        onMarkAsLearned={handleMarkAsLearned} // Передаем функцию для пометки как выученного
        onNextCard={onNextCard} // Переход к следующей карточке
      />
      {/* Кнопка для перехода к следующей карточке */}
      {/*<Button onClick={onNextCard} variant="contained" sx={{ marginTop: 2 }}>*/}
      {/*  Next Card*/}
      {/*</Button>*/}
    </div>
  );
};

export default Flashcards;
