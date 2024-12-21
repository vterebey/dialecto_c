export const fetchQuizData = async () => {
  const response = await fetch('http://0.0.0.0:8080/api/processing/words/quiz/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch learned words");
  }

  const data = await response.json();
  return data; // Возвращаем выученные слова
};