import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import WordCard from "./WordCard";
import { markAsLearned, removeLearnedWord } from "../services/cardService";

const Flashcards = ({ cards = [], currentIndex, onNextCard, isLearning }) => {
  const [localCards, setLocalCards] = useState(cards);

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleMarkAsLearned = async (wordId) => {
    try {
      if (isLearning) {
        await markAsLearned(wordId);
      } else {
        await removeLearnedWord(wordId);
      }

      // Удаляем текущую карточку и переходим к следующей
      const updatedCards = localCards.filter((card) => card.id !== wordId);
      setLocalCards(updatedCards);

      if (updatedCards.length === 0) {
        onNextCard(); // Уведомляем родительский компонент о завершении
      }
    } catch (error) {
      console.error("Error processing word:", error);
    }
  };

  if (localCards.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
        No cards available.
      </Typography>
    );
  }

  const currentCard = localCards[currentIndex];

  return (
    <div>
      <WordCard
        id={currentCard.id}
        word={currentCard.word}
        audio_pronciations={currentCard.audio_pronciations}
        definitions={currentCard.definitions}
        onMarkAsLearned={() => handleMarkAsLearned(currentCard.id)}
        isLearning={isLearning}
        onNextCard={onNextCard}
      />
    </div>
  );
};

export default Flashcards;
