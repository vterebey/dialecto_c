import axios from "axios";

export const fetchCards = async (limit) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`http://0.0.0.0:8080/api/processing/words/?limit=${limit}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data; // возвращаем данные ответа
  } catch (error) {
    console.error("Error fetching cards:", error);
    return { error: error.response ? error.response.data : "Unknown error" };
  }
};

export const markAsLearned = async (wordId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://0.0.0.0:8080/api/processing/words/${wordId}/learned/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Передайте токен, если используется аутентификация
            },
        });

        if (response.ok) {
            console.log("Word marked as learned!");
        } else {
            console.error("Failed to mark word as learned");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://0.0.0.0:8080/api/processing/categories/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Возвращаем категории
        } else {
            console.error("Failed to fetch categories");
            return [];
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const markCategoryAsLearned = async (categoryId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://0.0.0.0:8080/api/processing/categories/${categoryId}/learned/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Передайте токен, если используется аутентификация
            },
        });

        if (response.ok) {
            console.log("Category marked as learned!");
        } else {
            console.error("Failed to mark category as learned");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export const fetchWordsByCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://0.0.0.0:8080/api/processing/words/?category=${categoryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.results; // Возвращаем слова
        } else {
            console.error("Failed to fetch words by category");
            return [];
        }
    } catch (error) {
        console.error("Error fetching words by category:", error);
        return [];
    }
};

export const fetchLearnedCategories = async () => {
  const response = await fetch('http://0.0.0.0:8080/api/processing/categories/learned', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}`,
    },
  });
  const data = await response.json();
  return data; // Возвращаем уровни
};
