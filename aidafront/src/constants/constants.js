const constants = {
}
constants.PROJECT_NAME = "AIDA"
constants.AIDA_API = "aida_api"
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
  }
]
constants.HOME_TABS = [
  { id: 0, name: "User" },
  {id:1, name: "Company"},
  {id:2, name: "Device"},
  {id:3, name: "Camera"},
  {id:4, name: "Camera Visible For User"},
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
export default constants