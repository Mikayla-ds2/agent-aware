const question = document.querySelector('#question')
const choices = document.querySelectorAll('.choice-text')
const progressText = document.querySelector('#progressText')
const scoreText = document.querySelector('#score')
const progressBarFull = document.querySelector('#progressBarFull')

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = [
    {
        question: "Which best fits the definition of Artificial Intelligence?",
        choice1: '1',
        choice2: '1',
        choice3: '1',
        choice4: '1',
        answer = 1,
        

    }
]