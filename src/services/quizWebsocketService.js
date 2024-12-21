class QuizWebSocket {
  static socket = null;
  static timer = null;
  static roomName = null; // Имя комнаты для подключения
  static reconnectTimeout = null; // Таймер для автоматического переподключения

  static connect(roomName, handleQuestion, handleEndGame, onConnected) {
    // Если WebSocket уже подключён, не создаём новое соединение
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected.");
      return;
    }

    // Сохраняем имя комнаты
    this.roomName = roomName;

    // Получаем токен из localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    // Создаём WebSocket подключение
    const socketUrl = `ws://0.0.0.0:8010/ws/quiz/${roomName}/?token=${encodeURIComponent(token)}`;
    console.log("Connecting to WebSocket:", socketUrl);

    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.clearReconnect(); // Очищаем таймер переподключения
      this.send("start_quiz", {});
      if (onConnected) {
        onConnected();
      }
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      switch (data.type) {
        case "quiz_question":
          this.handleQuizData(data, handleQuestion);
          break;
        case "end_game":
          this.handleEndGame(data.message, handleEndGame);
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.clearTimer();
      //this.scheduleReconnect(handleQuestion, handleEndGame, onConnected); // Запускаем переподключение
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.clearTimer();
      //this.scheduleReconnect(handleQuestion, handleEndGame, onConnected);
    };
  }

  static handleQuizData(quizData, handleQuestion) {
    console.log("Received quiz data:", quizData);
    this.clearTimer();

    // Обработка вопроса
    handleQuestion(quizData);

    // Запускаем таймер (10 секунд)
    let remainingTime = 5;
    this.timer = setInterval(() => {
      remainingTime -= 1;
      console.log(`Time left: ${remainingTime}s`);

      if (remainingTime <= 0) {
        console.warn("Time is up for the current question.");
        this.clearTimer();
      }
    }, 1000);
  }

  static handleEndGame(message, handleEndGame) {
    console.log("Game ended:", message);
    this.clearTimer();
    handleEndGame(message);
    this.disconnect();
  }

  static clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  static send(action, data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          // Формируем объект данных с действием и переданными данными
          const message = {
              action: action,
              question_index: data.question_index,
              selected_option: data.selected_option
          };

          // Преобразуем объект в строку JSON
          const messageString = JSON.stringify(message);

          // Отправляем строку в формате JSON
          this.socket.send(messageString);
      } else {
          console.error("WebSocket is not connected.");
      }
  }

  static disconnect() {
    this.clearTimer();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.clearReconnect();
  }

  static scheduleReconnect(handleQuestion, handleEndGame, onConnected) {
    if (this.reconnectTimeout) {
      return; // Уже запланировано переподключение
    }

    console.log("Scheduling reconnect in 5 seconds...");
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null; // Сбрасываем таймер
      this.connect(this.roomName, handleQuestion, handleEndGame, onConnected);
    }, 5000);
  }

  static clearReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null
    }
  }
}

export { QuizWebSocket };
