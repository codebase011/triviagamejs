console.log("renderizador")
import { loadQuestions } from "./consultas.js";

let questions = [];
let questionIndex = 0;

const $triviaQuestion = document.querySelector("#trivia-question");
const $triviaOptions = document.querySelector("#trivia-options");
const $buttonCheckAnswer = document.querySelector('#button-check-answer')

$buttonCheckAnswer?.addEventListener('click', () => {
  const $liSelectedAnswer = document.querySelector('li.selected-answer')
  console.log($liSelectedAnswer?.textContent)
})

/*********************************************************************************************************
 * Esta funcion inicia el juego con la primera pregunta (la pregunta 0 del array)
 *********************************************************************************************************/
async function startTrivia() {
  questions = await loadQuestions();
  showQuestion(questions[0]);
  console.log(questions);
}

/*********************************************************************************************************
 * Mostrar el listado de películas a modo de "menú"
 ***********************o**********************************************************************************/
async function showQuestion(index) {
  const questionData = questions[questionIndex];
  // Juntar las respuestas correctas con la incorrecta para hacer un array de respuestas
  const answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];

  console.log(answers);
  $triviaQuestion.textContent = questionData.question;
  $triviaOptions.innerHTML = `${answers
    .map((answer, index) => `<li>${answer}</li>`)
    .join("")}`;

  // Añadir los eventos a cada respuesta
  const $options = Array.from(document.querySelectorAll("li"));
  $options.forEach(($li) =>
    $li.addEventListener("click", () => {
      console.log($li.textContent);
      // Eliminar primero el estilo si se habia seleccionado otra respuesta
      document.querySelector('li.selected-answer')?.classList.remove('selected-answer')
      // Añadir el estilo a la respuesta seleccionada 
      $li.classList.add("selected-answer")
    })
  );
}

export { showQuestion, startTrivia };
