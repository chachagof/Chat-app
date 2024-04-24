import userServices from '../services/userServices.js'

const userController = {
register: (req, res, next) => {
  userServices.register(req, (err, data) => {
    err ? next(err) : res.json(data)
  })
},
signin:(req, res, next)=>{
  userServices.signin(req, (err, data)=>{
    err ? next(err) : res.json(data);
  })
},
signout:(req, res, next)=>{
  userServices.signout(req, (err, data)=>{
    err ? next(err) : res.json(data)
  })
},
getUser:(req, res, next)=>{
  userServices.getUser(req, (err, data) => {
    err ? next(err) : res.json(data);
  });},
editUser:(req, res, next)=>{
  userServices.editUser(req, (err, data) => {
    err ? next(err) : res.json(data);
  });}

}

export default userController;