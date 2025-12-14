// 虚拟用户数据
export const mockUsers = [
  { id: 1, userName: 'admin', password: 'admin123', userRole: 1, createDate: '2024-01-15' },
  { id: 2, userName: 'zhangsan', password: '123456', userRole: 0, createDate: '2024-03-20' },
  { id: 3, userName: 'lisi', password: '123456', userRole: 0, createDate: '2024-04-10' },
  { id: 4, userName: 'wangwu', password: '123456', userRole: 0, createDate: '2024-05-08' },
  { id: 5, userName: 'zhaoliu', password: '123456', userRole: 0, createDate: '2024-06-22' },
  { id: 6, userName: 'sunqi', password: '123456', userRole: 0, createDate: '2024-07-15' },
  { id: 7, userName: 'zhouba', password: '123456', userRole: 0, createDate: '2024-08-30' },
  { id: 8, userName: 'wujiu', password: '123456', userRole: 0, createDate: '2024-09-12' },
  { id: 9, userName: 'zhengshi', password: '123456', userRole: 0, createDate: '2024-10-25' },
  { id: 10, userName: 'liuyi', password: '123456', userRole: 0, createDate: '2024-11-18' },
];

// 虚拟题目数据
export const mockQuestions = [
  {
    id: 1,
    question: 'JavaScript中，以下哪个方法可以将数组转换为字符串？',
    answers: [
      { text: 'toString()', correct: true },
      { text: 'toArray()', correct: false },
      { text: 'convert()', correct: false },
      { text: 'stringify()', correct: false },
    ],
  },
  {
    id: 2,
    question: 'React中，用于管理组件状态的Hook是？',
    answers: [
      { text: 'useEffect', correct: false },
      { text: 'useState', correct: true },
      { text: 'useContext', correct: false },
      { text: 'useRef', correct: false },
    ],
  },
  {
    id: 3,
    question: 'CSS中，以下哪个属性用于设置元素的外边距？',
    answers: [
      { text: 'padding', correct: false },
      { text: 'border', correct: false },
      { text: 'margin', correct: true },
      { text: 'spacing', correct: false },
    ],
  },
  {
    id: 4,
    question: 'HTML5中，用于定义导航链接的语义化标签是？',
    answers: [
      { text: '<navigation>', correct: false },
      { text: '<nav>', correct: true },
      { text: '<menu>', correct: false },
      { text: '<links>', correct: false },
    ],
  },
  {
    id: 5,
    question: '以下哪个不是JavaScript的数据类型？',
    answers: [
      { text: 'undefined', correct: false },
      { text: 'boolean', correct: false },
      { text: 'float', correct: true },
      { text: 'symbol', correct: false },
    ],
  },
  {
    id: 6,
    question: 'Git中，用于查看提交历史的命令是？',
    answers: [
      { text: 'git status', correct: false },
      { text: 'git log', correct: true },
      { text: 'git history', correct: false },
      { text: 'git show', correct: false },
    ],
  },
];

// 虚拟评分记录
export const mockScores = [
  { id: 1, userName: 'zhangsan', score: 80, correctCount: 4, totalQuestions: 5, createTime: '2024-12-10 10:30:00' },
  { id: 2, userName: 'lisi', score: 60, correctCount: 3, totalQuestions: 5, createTime: '2024-12-10 11:20:00' },
  { id: 3, userName: 'wangwu', score: 100, correctCount: 5, totalQuestions: 5, createTime: '2024-12-11 09:15:00' },
  { id: 4, userName: 'zhaoliu', score: 40, correctCount: 2, totalQuestions: 5, createTime: '2024-12-11 14:45:00' },
  { id: 5, userName: 'sunqi', score: 80, correctCount: 4, totalQuestions: 5, createTime: '2024-12-12 08:30:00' },
];
