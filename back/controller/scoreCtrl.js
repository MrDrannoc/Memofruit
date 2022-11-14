const Score = require('../model/score.js'); // récupère le modèle score

// Héritage
class ScoreCtrl extends Score {

    // Encapsulation
    // récupére le meilleur temps dans la table "scores"
    async getBestScore (ctx) {
        ctx.body = await new Promise((resolve, reject) => {
            ctx.db.get("SELECT MIN(Score) as bestScore FROM Scores", (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // insére dans la table "scores" le temps de l'utilisateur
    async setScore (ctx) {
        ctx.body = await new Promise((resolve, reject) => {
            const result = new ScoreCtrl(ctx.request.body.score);
            ctx.db.run(`INSERT INTO Scores (Score) VALUES  (${result.score})`, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = ScoreCtrl;