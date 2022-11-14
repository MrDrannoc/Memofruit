const Koa = require('koa'), // framework web conçu pour les aplication Web et les API
    bodyParser = require('koa-bodyparser'), // permet d'analyser le corps des requetes
    serve = require('koa-static'); // Permet l'execution de fichier statique

const db = require('./back/db.js'), // Récupere ma base de données
    router = require('./back/routes'); // Récupére les routes de mon API

// Créer une nouvelle instance de Koa
const app = new Koa();

// Ajouter la base de données au contexte de Koa
app.context.db = db;

// intègre les middlewares à l'application Koa
app
    .use(bodyParser())
    .use(serve(`${__dirname}/front`))
    .use(router.routes());

// démarre l'application sur le port 8080
app.listen(8080);