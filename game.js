const question = document.querySelector('#question');
const choices = document.querySelectorAll('.choice-text');
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const mcqContainer = document.querySelector('#mcqContainer');
const tfContainer = document.querySelector('#tfContainer');
const gameScreen = document.querySelector('#game');
const endScreen = document.querySelector('#end');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let modelLinkClicked = false;

let questions = [
    {
        type: 'mcq',
        question: "Which best fits the definition of Artificial Intelligence?",
        choice1: 'Techniques where the computer (or artificial agent) uses experience/data to build a model that can then be used convert a new input into a predicted output.',
        choice2: 'Learning a model to predict a numerical output',
        choice3: 'A computer (or artificial agent) that performs well on tasks that involve uncertainty.',
        choice4: 'Looping over a fixed set of parameter combinations',
        answer: 3
    },
    {
        type: 'tf',
        question: 'Intelligence is measured on a binary scale.',
        answer: false
    },
    {
        type: 'mcq',
        question: 'What is an agent in AI?',
        choice1: 'An entity that perceives and acts.',
        choice2: 'A hardware component used to store and retrieve large datasets.',
        choice3: 'A human supervisor responsible for overseeing machine learning algorithms.',
        choice4: 'A mathematical formula used to calculate the output of a neural network.',
        answer: 1
    },
    {
        type: 'tf',
        question: 'You got the output of the example model!',
        answer: true
    }
];

const score_points = 100;
const max_questions = questions.length;

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset.number;

        checkMCQAnswer(parseInt(selectedAnswer), selectedChoice.parentElement);
    });
});

document.querySelectorAll('.tf-choice').forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedAnswer = e.target.dataset.answer === 'true';
        checkTFAnswer(selectedAnswer, e.target);
    });
});
window.addEventListener('load', () => {
    console.log('DOM loaded, starting game...');
    startGame();
});

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    
    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= max_questions) {
        endGame();
        return;
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${max_questions}`;
    progressBarFull.style.width = `${(questionCounter / max_questions) * 100}%`;

    currentQuestion = availableQuestions.shift();
    question.innerText = currentQuestion.question;

    if (currentQuestion.question && currentQuestion.question.includes("example model")) {
        document.querySelector('#modelInterface').classList.remove('hidden');
        document.querySelector('#modelInterface').scrollIntoView({behavior: 'smooth'});
    }
    else{
        document.querySelector('#modelInterface').classList.add('hidden')
    }

    mcqContainer.classList.add('hidden');
    tfContainer.classList.add('hidden');

    if (currentQuestion.type === 'mcq') {
        showMCQQuestion();
    } else if (currentQuestion.type === 'tf') {
        showTFQuestion();
    }

    acceptingAnswers = true;
}

function showMCQQuestion() {
    mcqContainer.classList.remove('hidden');
    
    choices.forEach((choice, index) => {
        const number = index + 1;
        choice.innerText = currentQuestion['choice' + number];
        choice.parentElement.classList.remove('correct', 'incorrect');
    });
}

function showTFQuestion() {
    tfContainer.classList.remove('hidden');
    
    // Reset button styles
    document.querySelectorAll('.tf-choice').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
}

function checkMCQAnswer(selectedAnswer, selectedElement) {
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
        selectedElement.classList.add('correct');
        incrementScore(score_points);
    } else {
        selectedElement.classList.add('incorrect');
        // Show correct answer
        choices.forEach((choice, index) => {
            if (index + 1 === currentQuestion.answer) {
                choice.parentElement.classList.add('correct');
            }
        });
    }
    
    setTimeout(() => {
        getNewQuestion();
    }, 400);
}

function checkTFAnswer(selectedAnswer, selectedElement) {
    if (
        currentQuestion.question.includes('example model') && !modelLinkClicked
    ) {
        alert("Please click the link and view the AI model output before answering!");
        acceptingAnswers = true;
        return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
        selectedElement.classList.add('correct');
        incrementScore(score_points);
    } else {
        selectedElement.classList.add('incorrect');
        // Show correct answer
        document.querySelectorAll('.tf-choice').forEach(btn => {
            if ((btn.dataset.answer === 'true') === currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
    }
    
    setTimeout(() => {
        getNewQuestion();
    }, 400);
}

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

function endGame() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    document.querySelector('#finalScore').innerText = score;
}

function setModelClicked() {
    modelLinkClicked = true;
}