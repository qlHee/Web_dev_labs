// 检查用户是否已登录
function checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 初始化页面元素
const welcomeSection = document.getElementById('welcome-section');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const startButton = document.getElementById('start-btn');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const retryButton = document.getElementById('retry-btn');
const logoutButton = document.getElementById('logout-btn');

const totalQuestionsSpan = document.getElementById('total-questions');
const maxScoreSpan = document.getElementById('max-score');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsQuizSpan = document.getElementById('total-questions-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const userScoreSpan = document.getElementById('user-score');
const maxScoreResultSpan = document.getElementById('max-score-result');
const correctAnswersSpan = document.getElementById('correct-answers');
const totalQuestionsResultSpan = document.getElementById('total-questions-result');
const resultFeedback = document.getElementById('result-feedback');

// 全局变量
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let answeredQuestions = []; // 记录已答题目
let timer;
let timeLeft = 0;
let score = 0;

// 初始化
function init() {
    if (!checkLogin()) return;
    
    // 为按钮添加事件监听器
    startButton.addEventListener('click', fetchQuestionsAndStart);
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', showNextQuestion);
    submitButton.addEventListener('click', submitQuiz);
    retryButton.addEventListener('click', restartQuiz);
    logoutButton.addEventListener('click', logout);
    
    // 显示欢迎页面
    showWelcomeSection();
}

// 从后端获取题目并开始测试
function fetchQuestionsAndStart() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    
    axios.get('/api/getQuestion', {
        headers: {
            'token': token
        }
    })
    .then(function(response) {
        const res = response.data;
        if (res.code === 1 && Array.isArray(res.data)) {
            quizQuestions = res.data;
            totalQuestionsSpan.textContent = quizQuestions.length;
            maxScoreSpan.textContent = quizQuestions.length;
            startQuiz();
        } else {
            alert(res.msg || '获取题目失败');
        }
    })
    .catch(function(error) {
        alert('请求题目失败，请稍后重试');
        console.error(error);
    });
}

// 开始测试
function startQuiz() {
    // 初始化变量
    currentQuestionIndex = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    answeredQuestions = new Array(quizQuestions.length).fill(false);
    score = 0;
    
    // 更新UI
    welcomeSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    
    // 设置总题数
    totalQuestionsQuizSpan.textContent = quizQuestions.length;
    
    // 显示第一题
    showQuestion(currentQuestionIndex);
    
    // 开始计时
    startTimer(30 * 60); // 30分钟
}

// 显示指定题目
function showQuestion(index) {
    const question = quizQuestions[index];
    const isAnswered = answeredQuestions[index];
    
    // 更新问题索引
    currentQuestionSpan.textContent = index + 1;
    
    // 更新问题文本
    questionText.textContent = question.question;
    
    // 清空选项容器
    optionsContainer.innerHTML = '';
    
    // 隐藏答题反馈
    const feedbackDiv = document.getElementById('answer-feedback');
    feedbackDiv.classList.add('hidden');
    
    // 添加选项
    question.answers.forEach((answer, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = answer.text;
        
        // 如果已答题，显示正确/错误状态
        if (isAnswered) {
            if (answer.correct) {
                optionElement.classList.add('correct');
            }
            if (userAnswers[index] === i && !answer.correct) {
                optionElement.classList.add('incorrect');
            }
            if (userAnswers[index] === i) {
                optionElement.classList.add('selected');
            }
        } else {
            // 未答题时可以点击选择
            optionElement.addEventListener('click', function() {
                // 保存用户答案
                userAnswers[index] = i;
                answeredQuestions[index] = true;
                
                // 判断是否正确并更新得分
                if (answer.correct) {
                    score++;
                }
                
                // 显示答案结果
                showAnswerResult(index);
            });
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // 如果已答题，显示之前的答题反馈
    if (isAnswered) {
        showFeedbackForAnswered(index);
    }
    
    // 更新按钮状态
    updateButtonStates();
}

// 显示已答题目的反馈
function showFeedbackForAnswered(index) {
    const question = quizQuestions[index];
    const userAnswerIndex = userAnswers[index];
    const userAnswer = question.answers[userAnswerIndex];
    const isCorrect = userAnswer.correct;
    
    let correctAnswerText = '';
    question.answers.forEach((answer) => {
        if (answer.correct) {
            correctAnswerText = answer.text;
        }
    });
    
    const feedbackDiv = document.getElementById('answer-feedback');
    const feedbackResult = document.getElementById('feedback-result');
    const feedbackYourAnswer = document.getElementById('feedback-your-answer');
    const feedbackCorrectAnswer = document.getElementById('feedback-correct-answer');
    
    feedbackDiv.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');
    feedbackResult.classList.remove('correct', 'incorrect');
    
    if (isCorrect) {
        feedbackDiv.classList.add('correct-feedback');
        feedbackResult.classList.add('correct');
        feedbackResult.textContent = '✓ 回答正确！';
        feedbackYourAnswer.textContent = '你的答案：' + userAnswer.text;
        feedbackCorrectAnswer.textContent = '';
    } else {
        feedbackDiv.classList.add('incorrect-feedback');
        feedbackResult.classList.add('incorrect');
        feedbackResult.textContent = '✗ 回答错误';
        feedbackYourAnswer.textContent = '你的答案：' + userAnswer.text;
        feedbackCorrectAnswer.textContent = '正确答案：' + correctAnswerText;
    }
}

// 显示答案结果
function showAnswerResult(index) {
    console.log('showAnswerResult called, index:', index);
    const question = quizQuestions[index];
    const options = document.querySelectorAll('.option');
    const userAnswerIndex = userAnswers[index];
    const userAnswer = question.answers[userAnswerIndex];
    const isCorrect = userAnswer.correct;
    console.log('isCorrect:', isCorrect, 'userAnswer:', userAnswer.text);
    
    // 找到正确答案
    let correctAnswerText = '';
    question.answers.forEach((answer) => {
        if (answer.correct) {
            correctAnswerText = answer.text;
        }
    });
    
    options.forEach((option, i) => {
        const answer = question.answers[i];
        if (answer.correct) {
            option.classList.add('correct');
        }
        if (userAnswers[index] === i && !answer.correct) {
            option.classList.add('incorrect');
        }
        if (userAnswers[index] === i) {
            option.classList.add('selected');
        }
    });
    
    // 显示答题反馈
    const feedbackDiv = document.getElementById('answer-feedback');
    const feedbackResult = document.getElementById('feedback-result');
    const feedbackYourAnswer = document.getElementById('feedback-your-answer');
    const feedbackCorrectAnswer = document.getElementById('feedback-correct-answer');
    
    console.log('feedbackDiv:', feedbackDiv);
    feedbackDiv.classList.remove('hidden', 'correct-feedback', 'incorrect-feedback');
    feedbackResult.classList.remove('correct', 'incorrect');
    
    if (isCorrect) {
        feedbackDiv.classList.add('correct-feedback');
        feedbackResult.classList.add('correct');
        feedbackResult.textContent = '✓ 回答正确！';
        feedbackYourAnswer.textContent = '你的答案：' + userAnswer.text;
        feedbackCorrectAnswer.textContent = '';
    } else {
        feedbackDiv.classList.add('incorrect-feedback');
        feedbackResult.classList.add('incorrect');
        feedbackResult.textContent = '✗ 回答错误';
        feedbackYourAnswer.textContent = '你的答案：' + userAnswer.text;
        feedbackCorrectAnswer.textContent = '正确答案：' + correctAnswerText;
    }
    console.log('feedbackDiv classes after:', feedbackDiv.className);
    
    // 更新按钮状态
    updateButtonStates();
}

// 更新按钮状态
function updateButtonStates() {
    // 第一题禁用"上一题"按钮
    prevButton.disabled = currentQuestionIndex === 0;
    
    // 当前题目已答才能进入下一题
    const isCurrentAnswered = answeredQuestions[currentQuestionIndex];
    nextButton.disabled = !isCurrentAnswered;
    
    // 最后一题显示"提交"按钮，隐藏"下一题"按钮
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
        submitButton.disabled = !isCurrentAnswered;
    } else {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }
}

// 显示上一题
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// 显示下一题
function showNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

// 提交测试
function submitQuiz() {
    // 停止计时
    clearInterval(timer);
    
    // 提交成绩到后端
    const token = localStorage.getItem('token');
    axios.post('/api/submitQuiz', {
        score: score,
        totalQuestions: quizQuestions.length,
        correctCount: score
    }, {
        headers: { 'token': token }
    }).catch(function(error) {
        console.error('提交成绩失败', error);
    });
    
    // 更新结果页面
    userScoreSpan.textContent = score;
    maxScoreResultSpan.textContent = quizQuestions.length;
    correctAnswersSpan.textContent = score;
    totalQuestionsResultSpan.textContent = quizQuestions.length;
    
    // 显示反馈
    let feedbackMessage = '';
    const percentage = (score / quizQuestions.length) * 100;
    
    if (percentage >= 90) {
        feedbackMessage = '太棒了！你的表现非常出色！';
    } else if (percentage >= 70) {
        feedbackMessage = '做得好！你掌握了大部分内容。';
    } else if (percentage >= 50) {
        feedbackMessage = '不错的努力，但还有提升的空间。';
    } else {
        feedbackMessage = '继续加油，你可以做得更好！';
    }
    
    resultFeedback.textContent = feedbackMessage;
    
    // 显示结果页面
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

// 重新开始测试
function restartQuiz() {
    welcomeSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// 开始计时器
function startTimer(seconds) {
    const timeLeftElement = document.getElementById('time-left');
    timeLeft = seconds;
    
    // 更新显示
    updateTimerDisplay();
    
    // 每秒更新一次
    timer = setInterval(function() {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('时间到！');
            submitQuiz();
        }
        
        updateTimerDisplay();
    }, 1000);
}

// 更新计时器显示
function updateTimerDisplay() {
    const timeLeftElement = document.getElementById('time-left');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timeLeftElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 显示欢迎部分
function showWelcomeSection() {
    welcomeSection.classList.remove('hidden');
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    // 固定显示5道题目
    totalQuestionsSpan.textContent = 5;
    maxScoreSpan.textContent = 5;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
