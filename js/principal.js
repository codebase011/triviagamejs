/*** Práctica 5.05 - Trivial Game
 *  Lo he hecho todo en inglés ya que la API y las preguntas / respuestas están en este idioma 
 */

import { loadQuestions } from "./consultas.js";

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  // Selectores
  const $triviaQuestion = document.querySelector("#trivia-question");
  const $triviaOptions = document.querySelector("#trivia-options");
  const $buttonTryLoadQuestionsAgain = document.querySelector("#button-try-load-questions-again")
  const $buttonCheckAnswer = document.querySelector("#button-check-answer");
  const $buttonPlayAgain = document.querySelector("#button-play-again");
  const $pResult = document.querySelector("#trivia-result");
  const $pResultScore = document.querySelector("#trivia-result-score");
  const $pQuestionCount = document.querySelector("#question-count");

  // Variables
  let questions = []; // Array donde se cargran todos los datos de las preguntas
  let questionIndex = 0; // Pregunta actual
  let totalQuestions = 0; // Cantidad total de preguntas
  let correctAnswersCount = 0; // Para llevar la cuenta de las respuestas acertadas

  // Event listeners
  $buttonTryLoadQuestionsAgain?.addEventListener("click", startGame)
  $buttonCheckAnswer?.addEventListener("click", checkAnswer);
  $buttonPlayAgain?.addEventListener("click", restartGame);

  /*********************************************************************************************************
   * Esta funcion inicia el juego con la primera pregunta (la pregunta 0 del array)
   *********************************************************************************************************/
  async function startGame() {
    $pResult.textContent = "Loading questions..."

    questions = await loadQuestions();

    // Si no se han recibido preguntas es que ha habido un error
    if (!questions) {
      $pResult.textContent = "Error loading questions."
      $buttonTryLoadQuestionsAgain.classList.remove("hidden")
      return
    }

    // Si se han cargado las preguntas, ocultar el boton de "Try again"
    // Y mostrar el de "Check answer" y el contador de preguntas
    // Y mostrar la pregunta 0
    $buttonTryLoadQuestionsAgain.classList.add("hidden")
    $pQuestionCount?.classList.remove("hidden")
    totalQuestions = questions.length;
    showQuestion(questions[0]);
    $buttonCheckAnswer.classList.remove("hidden")
    console.log(questions);
  }

  /*********************************************************************************************************
   * Esta funcion reinicia el juego
   *********************************************************************************************************/
  function restartGame() {
    // Resetear las variables del juego
    questions = [];
    questionIndex = 0;
    totalQuestions = 0;
    correctAnswersCount = 0;

    // Ocultar el boton de "PLAY AGAIN" y mostrar el de "CHECK ANSWER"
    $buttonPlayAgain?.classList.add("hidden");
    $buttonCheckAnswer?.classList.remove("hidden");

    // Eliminar resultados
    $pResultScore.textContent = ""

    // Empezar el juego
    startGame();
  }

  function updateQuestionCount() {
    $pQuestionCount.textContent = `${questionIndex + 1} / ${totalQuestions}`;
  }

  /*********************************************************************************************************
   * Mostrar la pregunta que toca
   ***********************o**********************************************************************************/
  function showQuestion() {
    const questionData = questions[questionIndex];
    // Juntar las respuestas correctas con la incorrecta para hacer un array de respuestas
    const answers = [
      ...questionData.incorrect_answers,
      questionData.correct_answer,
    ];

    // Antes de seguir
    updateQuestionCount();
    $pResult.textContent = "";
    // Activar el boton de "CHECK ANSWER"
    $buttonCheckAnswer.disabled = false;

    console.log(answers);
    $triviaQuestion.textContent = HTMLDecode(questionData.question);
    $triviaOptions.innerHTML = `${
      answers
        .map(answer => `<li>${answer}</li>`)
        .join("")
    }`;

    // Añadir los eventos a cada respuesta
    const $options = document.querySelectorAll("li");
    $options.forEach(($li) =>
      $li.addEventListener("click", () => {
        console.log($li.textContent);
        // Eliminar primero el estilo si se habia seleccionado otra respuesta
        document
          .querySelector("li.selected-answer")
          ?.classList.remove("selected-answer");
        // Eliminar el texto de "Select an option first!"
        $pResult.textContent = "";
        // Añadir el estilo a la respuesta seleccionada
        $li.classList.add("selected-answer");
      })
    );
  }

  /*********************************************************************************************************
   * Comprobar respuesta y cargar siguiente pregunta (si quedan)
   ***********************o**********************************************************************************/
  function checkAnswer() {
    const $liSelectedAnswer = document.querySelector("li.selected-answer");
    const selectedAnswer = $liSelectedAnswer?.textContent;
    const correctAnswer = HTMLDecode(questions[questionIndex].correct_answer);

    const $liAnswers = document.querySelectorAll("li")
    const $liCorrectAnswer = Array.from($liAnswers).find((li) => li.textContent === correctAnswer)

    console.log($liCorrectAnswer)

    if (!$liSelectedAnswer) {
      $pResult.textContent = "Select an option first!";
      return;
    }

    // Desactivar el boton de "CHECK ANSWER"
    $buttonCheckAnswer.disabled = true;

    if (selectedAnswer === correctAnswer) {
      correctAnswersCount++;
      $pResult.textContent = "✔️ Correct answer!";
      $liSelectedAnswer.classList.add("correct");
      // $liSelectedAnswer.textContent += "✔️"
    } else {
      $pResult.textContent = `❌ Incorrect answer (Correct answer: ${correctAnswer})`;
      $liCorrectAnswer.classList.add("correct")
      $liSelectedAnswer.classList.add("incorrect");
    }

    if (questionIndex === totalQuestions - 1) {
      $pResultScore.textContent = `Your score: ${correctAnswersCount} / ${totalQuestions}`;
      console.log($buttonPlayAgain);
      $buttonPlayAgain.classList.remove("hidden");
      $buttonCheckAnswer.classList.add("hidden");
    } else {
      setTimeout(() => {
        questionIndex++;
        showQuestion();
      }, 1500);
    }

    console.log(selectedAnswer, questions[questionIndex].correct_answer);
  }

  /*********************************************************************************************************
   * Algunos textos vienen con caracteres html, esta función es para transformarlos en texto normal
   ***********************o**********************************************************************************/
  // Ejemplo: "&lt;scroll&gt;&lt;/scroll&gt;"
  function HTMLDecode(text) {
    // text = "&lt;scroll&gt;&lt;/scroll&gt;";
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  }

  // Empezar el juego
  startGame();
});
