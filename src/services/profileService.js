export const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// profileService.js
export const fetchLearnedWords = async () => {
  const response = await fetch('http://0.0.0.0:8080/api/processing/learned-words/', {
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
