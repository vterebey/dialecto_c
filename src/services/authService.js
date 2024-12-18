import axios from "axios";

export const login = async (username, password) => {
  try {
    const response = await axios.post("http://0.0.0.0:8080/api/auth/login/", {
      username,
      password
    });
    return response.data; // возвращаем данные ответа
  } catch (error) {
    // Обработка ошибок
    console.error("Error during login:", error);
    return { error: error.response ? error.response.data : "Unknown error" };
  }
};

export const signup = async (username, password) => {
  try {
    const response = await axios.post("http://0.0.0.0:8080/api/auth/sign-up/", {
      username,
      password
    });
    return response.data; // возвращаем данные ответа
  } catch (error) {
    // Обработка ошибок
    console.error("Error during sign-up:", error);
    return { error: error.response ? error.response.data : "Unknown error" };
  }
};
