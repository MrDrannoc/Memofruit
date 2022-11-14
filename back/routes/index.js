const Router = require('@koa/router'); // middleware pour gérer les route de l'api
const ScoreCtrl = require('../controller/scoreCtrl.js'); // controlleur des scores

// Nouvelle instance du router avec le préfixe /api
const router = new Router({
    prefix: '/api'
});

// route qui permet avec la methode GET d'accéder au meilleur score
router.get('/scores', (ctx) =>
    new ScoreCtrl().getBestScore(ctx)
);

// route qui permet avec la methode POST de stocker dans la BDD le meilleur score
router.post('/scores', (ctx) =>
    new ScoreCtrl().setScore(ctx)
);

module.exports = router