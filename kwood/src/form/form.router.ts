import Express from 'express';
import logger from '../log';
import formService from './form.service'

const router = Express.Router();

router.get('/:user', function (req, res, next) {
    //if requesting forms by user
    if (isNaN(Number(req.params.user))) {
        logger.debug('in get/forms ' + req.params.user)
        formService.getFormsByUser(req.params.user).then((rest) => {
            console.log(req.params.username);
            res.send(JSON.stringify(rest));
        });
        // if requesting forms by id
    } else {
        logger.debug('in get/forms/id ' + req.params.user)
        formService.getFormByID(Number(req.params.user)).then((form) => {
            logger.debug(form?.startDate);
            res.send(JSON.stringify(form));
        });
    }
});

router.get('/', function(req, res,next){
    formService.getAllForms().then((forms)=>{
        res.send(JSON.stringify(forms));
    });
});

router.put('/', (req,res,next)=>{
    formService.updateForm(req.body).then((data)=>{
        res.send(data);
    })
})

router.post('/', (req, res, next) => {
    formService.addForm(req.body).then((data) => {
        logger.debug(data);
        res.sendStatus(201);
    }).catch((err) => {
        logger.error(err);
        res.sendStatus(500); // Server error, sorry
    })

})


export default router;