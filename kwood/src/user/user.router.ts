import express from 'express';
import * as user from './user';
import logger from '../log';
import publicDir from '../constant';
import userService from './user.service';

const router = express.Router();


router.get('/login', function (req: any, res, next) {
  if (req.session.user) {
    console.log(req.session.user);
    res.redirect('/home');
  }
  res.sendFile('login.html', { root: publicDir });
});

router.get('/:user', (req: any, res, next) => {
  userService.getUserByUsername(req.params.user).then((user)=>{
    res.send(JSON.stringify(user));
  })
});

router.get('/', (req: any, res, next) => {
  let u = { ...req.session.user };
  logger.debug('get / '+ u);
  //delete u.password;
  res.send(JSON.stringify(u));
});

router.post('/', function (req: any, res, next) {

  logger.debug('post ' + JSON.stringify(req.body));
  user.login(req.body.username, req.body.password).then((user) => {
    if (user === null) {
      res.sendStatus(401);
    }
    req.session.user = user;
    res.send(JSON.stringify(user))
  });
});

router.delete('/', (req, res, next) => {
  req.session.destroy((err) => logger.error(err));
  res.sendStatus(204);
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => logger.error(err));
  res.redirect('/');
});

router.put('/',(req,res,next)=>{
  userService.updateUser(req.body).then((data)=>{
    res.send(data);
  })
})
export default router;