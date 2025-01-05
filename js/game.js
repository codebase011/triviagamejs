import { HTMLDecode } from "./utils.js";
import { loadQuestions } from "./api.js";

("use strict");

// Selectores
const $triviaQuestion = document.querySelector("#trivia-question");
const $triviaOptions = document.querySelector("#trivia-options");
const $buttonTryLoadQuestionsAgain = document.querySelector(
  "#button-try-load-questions-again"
);
const $buttonCheckAnswer = document.querySelector("#button-check-answer");
const $buttonPlayAgain = document.querySelector("#button-play-again");
const $pResult = document.querySelector("#trivia-result");
const $pResultScore = document.querySelector("#trivia-result-score");
const $pQuestionCount = document.querySelector("#question-count");

// Estados del juego
// Estado 1: "esperando a que el usuario elija respuesta"
// Estado 2: "esperando a que se muestre la siguiente pregunta"
const GAME_STATES = {
  WAITING_ANSWER: "waiting_answer",
  WAITING_NEXT_QUESTION: "waiting_next_question"
}

// Variables
let questions = []; // Array donde se cargran todos los datos de las preguntas
let questionIndex = 0; // Pregunta actual
let totalQuestions = 0; // Cantidad total de preguntas
let correctAnswersCount = 0; // Para llevar la cuenta de las respuestas acertadas
let gameState = GAME_STATES.WAITING_ANSWER;

// Event listeners
$buttonTryLoadQuestionsAgain?.addEventListener("click", startGame);
$buttonPlayAgain?.addEventListener("click", restartGame);
$buttonCheckAnswer?.addEventListener("click", checkAnswer);

/*********************************************************************************************************
 * Esta funcion inicia el juego con la primera pregunta (la pregunta 0 del array)
 *********************************************************************************************************/
async function startGame() {
  $pResult.textContent = "Loading questions...";
  questions = await loadQuestions();

  // Si no se han recibido preguntas es que ha habido un error
  // El try-catch lo hago en el api.js
  if (!questions) {
    $pResult.textContent = "Error loading questions.";
    $buttonTryLoadQuestionsAgain.classList.remove("hidden");
    return;
  }

  // Eliminar el "Loading questions..."
  $pResult.textContent = "";

  // Guardar el numero de preguntas en la variable
  totalQuestions = questions.length;

  // Si se han cargado las preguntas, ocultar el boton de "Try again"
  // Y mostrar el contador de preguntas y el boton de "Check Answer"
  $buttonTryLoadQuestionsAgain?.classList.add("hidden");
  $pQuestionCount?.classList.remove("hidden");
  $buttonCheckAnswer?.classList.remove("hidden");

  // Mostrar la siguiente (primera) pregunta
  nextQuestion();
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
  $pResultScore.textContent = "";

  // Empezar el juego
  startGame();
}

/*********************************************************************************************************
 * Actualizar el contador de pregutnas
 ***********************o**********************************************************************************/
function updateQuestionCount() {
  $pQuestionCount.textContent = `${questionIndex + 1} / ${totalQuestions}`;
}

/*********************************************************************************************************
 * Mostrar la pregunta que toca
 ***********************o**********************************************************************************/
function nextQuestion() {
  const questionData = questions[questionIndex];
  // Juntar las respuestas correctas con la incorrecta para hacer un array de respuestas
  const answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];

  // Eliminar el texto del resultado
  $pResult.textContent = "";

  // Actualizar el contador de preguntas
  updateQuestionCount();

  // Desactivar el boton de "CHECK ANSWER" hasta que se seleccione alguna pregunta
  $buttonCheckAnswer.disabled = true;

  // Mostrar la pregunta
  $triviaQuestion.textContent = HTMLDecode(questionData.question);

  // Mostrar el listado de opciones de respuesta
  $triviaOptions.innerHTML = `${answers
    .map((answer) => `<li>${answer}</li>`)
    .join("")}`;

  // Añadir los eventos a cada respuesta
  const $options = document.querySelectorAll("li");
  $options.forEach(($li) =>
    $li.addEventListener("click", () => {
      // Eliminar primero el estilo si se habia seleccionado otra respuesta
      document
        .querySelector("li.selected-answer")
        ?.classList.remove("selected-answer");
      $buttonCheckAnswer.disabled = gameState === GAME_STATES.WAITING_NEXT_QUESTION;
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

  const $liAnswers = document.querySelectorAll("li");
  const $liCorrectAnswer = Array.from($liAnswers).find(
    (li) => li.textContent === correctAnswer
  );

  // Desactivar el boton de "CHECK ANSWER"
  $buttonCheckAnswer.disabled = true;

  // Comprobar la respuesta
  if (selectedAnswer === correctAnswer) {
    correctAnswersCount++;
    $pResult.textContent = "✔️ Correct answer!";
    $liSelectedAnswer.classList.add("correct");
    // $liSelectedAnswer.textContent += "✔️"
  } else {
    $pResult.textContent = `❌ Incorrect answer (Correct answer: ${correctAnswer})`;
    $liCorrectAnswer.classList.add("correct");
    $liSelectedAnswer.classList.add("incorrect");
  }

  // Comprobar si se ha llegado al final
  if (questionIndex === totalQuestions - 1) {
    $pResultScore.textContent = `Your score: ${correctAnswersCount} / ${totalQuestions}`;
    $buttonPlayAgain.classList.remove("hidden");
    $buttonCheckAnswer.classList.add("hidden");
  } else {
    // Cambiar el estado para que no se pueda cambiar la respuesta mientras se carga la siguiente pregunta
    gameState = GAME_STATES.WAITING_NEXT_QUESTION;
    // Retardo para mostrar la siguiente pregunta
    setTimeout(() => {
      questionIndex++;
      // Cuando se muestra la siguiente pregunta, volver a cambiar el estado
      gameState = GAME_STATES.WAITING_ANSWER;
      nextQuestion();
    }, 1500);
  }
}

export { startGame };
