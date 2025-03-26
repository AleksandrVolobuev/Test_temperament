const gameMusic = document.querySelector(".gameMusic");
gameMusic.volume = 0.5; // Громкость музыки

let isMusicStarted = false; // Флаг для отслеживания запуска музыки

// Функция для запуска музыки
function startMusic() {
  if (!isMusicStarted) {
    gameMusic.play();
    isMusicStarted = true;
  }
}

// Функция обновления сообщения о текущем ходе
let currentQuestion = 0;

// Счетчик баллов
let score = 0;

// Контейнер, в котором отображаются вопросы и варианты ответов
const quizContainer = document.querySelector(".quiz");

// Кнопка "Следующий вопрос"
const nextButton = document.querySelector(".nextButton");
nextButton.addEventListener("click", nextQuestion);

const shuffleAnswers = (question) => {
  // Сохраняем ответы и баллы в массив объектов
  const answersWithScores = question.answers.map((answer, index) => ({
    answer,
    score: question.scores[index],
  }));

  // Перемешиваем ответы и их баллы
  answersWithScores.sort(() => Math.random() - 0.5);

  // Обновляем вопрос с перемешанными ответами и баллами
  question.answers = answersWithScores.map((item) => item.answer);
  question.scores = answersWithScores.map((item) => item.score);
};
questions;
// Функция для отображения текущего вопроса
function showQuestion() {
  // Получаем текущий вопрос из массива questions
  const q = questions[currentQuestion];

  // Перемешиваем ответы для текущего вопроса
  shuffleAnswers(q);

  // Заполняем контейнер текстом вопроса
  quizContainer.innerHTML = `<p>${q.text}</p>`;

  // Создаём контейнер для ответов с `flex`
  let answersHTML = `<div class="answers-container flex flex-col gap-2">`;

  // Перебираем все возможные ответы на вопрос
  q.answers.forEach((answer, i) => {
    // Добавляем радиокнопку в контейнер
    answersHTML += `<label class="flex items-center gap-2">
          <input type='radio' class="w-5 h-5 text-blue-500 focus:ring-blue-400" name='answer' value='${q.scores[i]}'> 
          ${answer}
      </label>`;
  });

  // Закрываем `div`
  answersHTML += `</div>`;

  // Вставляем в `quizContainer`
  quizContainer.innerHTML += answersHTML;
}


// Функция обработки ответа и перехода к следующему вопросу
function nextQuestion() {
  startMusic(); // Запускаем музыку при первом нажатии

  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) {
    score += parseInt(selected.value);
    console.log(score);
    currentQuestion++;

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
}

// Функция для показа итогового результата теста
function showResult() {
  const totalCategories = answers.length; // Количество типов
  const step = (questions.length * 3) / totalCategories; // Интервал

  // Переворачиваем шкалу (чем больше баллов, тем ближе к 0-й позиции)
  let index = totalCategories - 1 - Math.floor(score / step);

  // Гарантируем, что индекс не выходит за границы массива
  index = Math.max(0, Math.min(index, totalCategories - 1));

  let resultText = answers[index];

  // Вывод результата
  quizContainer.innerHTML = `<p class="font-bold mt-5 text-xl">${resultText}</p>`;

  // Меняем кнопку
  nextButton.textContent = "Пройти тест еще раз";
  nextButton.removeEventListener("click", nextQuestion);
  nextButton.addEventListener("click", resetTest);
}

// Функция для сброса теста
function resetTest() {
  score = 0;
  currentQuestion = 0;
  nextButton.textContent = "Ответить";
  showQuestion();

  // Убираем обработчик для сброса теста
  nextButton.removeEventListener("click", resetTest);

  // Восстанавливаем обработчик для "Следующего вопроса"
  nextButton.addEventListener("click", nextQuestion);
}

// Запускаем первый вопрос
showQuestion();
