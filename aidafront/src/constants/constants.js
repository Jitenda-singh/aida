const constants = {
}
constants.PROJECT_NAME = "AIDA"
constants.REACT_APP_AIDA_API_NAME= "aida_api"
constants.LEFT_MENU = [
  {
    id: 1,
    title: 'User',
    headerTitle: 'User',
    path: '/user'
  },
  {
    id: 2,
    title: 'Company',
    headerTitle: 'Company',
    path: '/company'
  },
  {
    id: 3,
    title: 'Device',
    headerTitle: 'Device',
    path: '/device'
  },
  {
    id: 4,
    title: 'Camera',
    headerTitle: 'Camera',
    path: '/camera'
  },
  {
    id: 5,
    title: 'Camera Visible For User',
    headerTitle: 'Camera Visible For User',
    path: '/camera-visibility'
  },
  {
    id: 6,
    title: "View1",
    path: "/view1"
  },
  {
    id: 7,
    title: "View2",
    path: "/view2"
  }
]
constants.ACTIONS={
  create: "create",
  update: "update",
  LOGOUT: 'logout'
}
constants.SUCCESS_MESSAGE= {
  TYPE: 'success'
}
constants.ERROR_MESSAGE= {
  TYPE: 'error'
}
constants.LIMIT_200 = 200
export default constants