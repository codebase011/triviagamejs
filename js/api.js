/***********************************************************************************
 * Consultar Preguntas a la api de opentdb
 ***********************************************************************************/
"use strict";

async function loadQuestions() {
  const url = "https://opentdb.com/api.php?amount=2&category=18&difficulty=medium";

  try {
    const res = await fetch(url);

    // Comprobar si la respuesta es correcta
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }

    const questionsData = await res.json();

    // console.log(questionsData.results)
    return questionsData.results;
  } catch (error) {
    console.error(
      "Error al solicitar lista de preguntas a la API: " + error.message
    );
    return null;
  }
}

export { loadQuestions };