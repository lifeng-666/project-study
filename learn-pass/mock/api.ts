// import AVATAR from '../src/assets/1.jpg';

const CourseList = [
  {
    id: 123,
    name: '数据库',
    teacher: '老张',
    cover: 'cover/kgasw8hu-bbb.jpg',
    token: 'fasfsafasfsafasfsafasfsafasfsa',
  },
  {
    id: 1234,
    name: 'c语言',
    teacher: '老张',
    cover: 'cover/kgasw8hu-bbb.jpg',
    token: 'fasfsafasfsafasfsafasfsafasfsa',
  },
  {
    id: 123345,
    name: '编译原理',
    teacher: '老张',
    cover: 'cover/kgk6ufnr-aaa.jpg',
    token: 'fasfsafasfsafasfsafasfsafasfsa',
  },
];
const VideoList = [
  {
    id: 63987387,
    name: '元的生产',
    completed: true,
  },
  {
    id: 3543453,
    name: '母猪的产后护理',
    completed: true,
  },
  {
    id: 24524534,
    name: '钢铁是怎样炼成的',
    completed: false,
  },
  {
    id: 3453453345345,
    name: '炉里奇迹',
    completed: false,
  },
];

export default {
  'POST /api/user/login': {
    code: 200,
    description: 'success',
    data: {
      username: 'lifeng',
      realname: '李锋',
      sex: true,
      college: '化工过程自动化',
      subject: '计算机科学与技术',
      rid: 2,
    },
  },
  'GET /api/user/getInfo': {
    code: 200,
    description: 'success',
    data: {
      username: 'lifeng',
      realname: '李锋',
      sex: true,
      college: '化工过程自动化',
      subject: '计算机科学',
    },
  },
  'PUT /api/user/updatePwd': {
    code: 200,
    description: 'success',
    data: null,
  },
  'POST /api/user/register': {
    code: 200,
    description: 'success',
    data: null,
  },
  'PUT /api/user/updateInfo': {
    code: 200,
    description: 'success',
    data: null,
  },

  'GET /api/course/getCourseListTeacher': {
    code: 200,
    description: '网络错误',
    data: CourseList,
  },
  'GET /api/course/getCourseListStudent': {
    code: 200,
    description: '网络错误',
    data: CourseList,
  },
  'GET /api/course/joinCourse': {
    code: 200,
    description: 'success',
    data: null,
  },
  'DELETE /api/course/deleteCourse/*': {
    code: 200,
    description: 'success',
    data: [],
  },
  'POST /api/course/createCourse': {
    code: 200,
    description: 'success',
    data: null,
  },
  'DELETE /api/video/deleteVideo/*': {
    code: 200,
    description: 'success',
    data: [],
  },
  'GET /api/video/getVideoList': {
    code: 200,
    description: 'success',
    data: VideoList,
  },
  'GET /api/video/getVideoProcess': {
    code: 200,
    description: 'success',
    data: 175,
  },
  'GET /api/video/getVideo': {
    code: 200,
    description: 'success',
    data: {
      id: 23123,
      path: 'video/泫雅 (현아)-베베 (练习室版)(蓝光).mp4',
      // path: 'video/kgu51vzr-FinalVideo_1561775197.788645.MP4',
      name: '微积分的应用',
      completed: false,
      process: 40,
    },
  },
  'POST /api/video/reportVideoProcess': {
    code: 200,
    description: 'success',
    data: null,
  },
  'POST /api/video/finishVideo': {
    code: 200,
    description: 'success',
    data: null,
  },
  'POST /api/video/addVideo': {
    code: 200,
    description: 'success',
    data: null,
  },

  'GET /api/qusetion/getQuestions': {
    code: 200,
    description: 'success',
    data: null,
  },
  'GET /api/document/getDocuments': {
    code: 200,
    description: 'success',
    data: [],
    // data: [
    //   {
    //     id: 4656,
    //     name: '数据库第一节课件',
    //     path: 'document/kgg4fivi-赵诗奇个人简历 (6).pdf',
    //     createTime: '2020-10-02 15:15',
    //   },
    //   {
    //     id: 456,
    //     name: '数据库第二节课件',
    //     path: 'document/kgg4fivi-赵诗奇个人简历 (6).pdf',
    //     createTime: '2020-10-02 15:15',
    //   },
    //   {
    //     id: 46323256,
    //     name: '学习学个屁',
    //     path: 'document/kgg49ubo-赵诗奇个人简历 (7).pd',
    //     createTime: '2020-10-02 15:15',
    //   },
    // ],
  },

  'DELETE /api/document/deleteDocument/*': {
    code: 200,
    description: 'success',
    data: [],
  },
  'POST /api/document/addDocument': {
    code: 200,
    description: 'success',
    data: null,
  },
};
