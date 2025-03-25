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
    score: question.scores[index]
  }));
  
  // Перемешиваем ответы и их баллы
  answersWithScores.sort(() => Math.random() - 0.5);
  
  // Обновляем вопрос с перемешанными ответами и баллами
  question.answers = answersWithScores.map(item => item.answer);
  question.scores = answersWithScores.map(item => item.score);
};

// Функция для отображения текущего вопроса
function showQuestion() {
  // Получаем текущий вопрос из массива questions
  const q = questions[currentQuestion];
  
  // Перемешиваем ответы для текущего вопроса
  shuffleAnswers(q);

  // Заполняем контейнер текстом вопроса
  quizContainer.innerHTML = `<p>${q.text}</p>`;

  // Перебираем все возможные ответы на вопрос
  q.answers.forEach((answer, i) => {
    // Добавляем радиокнопку для каждого ответа с его значением (баллом)
    quizContainer.innerHTML += `<label>
          <input type='radio' class="w-5 h-5 text-blue-500 focus:ring-blue-400" name='answer' value='${q.scores[i]}'> ${answer}
      </label><br>`;
  });
}

// Функция обработки ответа и перехода к следующему вопросу
function nextQuestion() {
  startMusic(); // Запускаем музыку при первом нажатии

  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) {
    score += parseInt(selected.value);
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
  // Определяем результат в зависимости от количества набранных баллов
  let resultText =
    score >= questions.length * 3.5
      ? answers[0]
      : score >= questions.length * 2.5
      ? answers[1]
      : score >= questions.length * 1.5
      ? answers[2]
      : answers[3];

  // Выводим результат на экран
  quizContainer.innerHTML = `<p class='result'>${resultText}</p>`;

  // Изменяем текст кнопки на "Пройти тест еще раз"
  nextButton.textContent = "Пройти тест еще раз";

  // Убираем обработчик для перехода к следующему вопросу
  nextButton.removeEventListener("click", nextQuestion);

  // Добавляем обработчик для сброса теста
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
