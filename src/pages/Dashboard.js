import React, { useState, useEffect } from "react";
import Flashcards from "../components/Flashcards";  // Импорт компонента Flashcards
import { fetchCards } from "../services/cardService";  // Сервис для получения карточек

const Dashboard = () => {
  const [cards, setCards] = useState([]);  // Инициализация как пустой массив
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchCards(20); // получаем данные с сервера
        if (Array.isArray(data.results)) {
          setCards(data.results);  // Сохраняем данные с полем results
        } else {
          setCards([]);  // Если нет данных, очищаем
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setCards([]);  // В случае ошибки очищаем
      }
    };
    loadCards();
  }, []);

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % cards.length;
      return nextIndex;
    });
  };



  return (
    <div>
      <h1>Word Cards</h1>
      {Array.isArray(cards) && cards.length > 0 ? (
        <Flashcards
          cards={cards}  // Передаем весь массив карточек
          currentIndex={currentIndex}  // Передаем индекс текущей карточки
          onNextCard={handleNextCard}  // Функция для перехода к следующей карточке
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Dashboard;
