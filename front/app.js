// ******************   Déclaration de variable   ******************
const boxes = ['banane.png', 'cerise.png', 'citron.png', 'fraise.png', 'framboise.png', 'orange.png', 'pastèque.png', 'pomme.png']; // Tableau avec liste des fruits
const game = {}; // Objet qui stock coté navigateur les informations du jeu (tableau, selection, temps de jeu ...)

// ******************   Requete API   ******************
// Recupére le meilleur score du back de l'application
function getBestScore () {
    $.ajax({
        url: 'http://localhost:8080/api/scores',
        method: 'GET',
        datatype: 'json'
    })
    .done(function(res){
        $('.score').text(res.bestScore);
    })
    .fail(function(err){
        console.log("La requête s'est terminée en échec. Infos : " + JSON.stringify(err));
    })
    .always(function(){
        console.log("Requête effectuée");
    });
}
// Envoi le score de l'utilisateur au back de l'application
function setScore (score) {
    $.ajax({
        url: 'http://localhost:8080/api/scores',
        data: { score: score },
        method: 'POST',
        datatype: 'json'
    })
    .done(function (res) {
        getBestScore();
    })
    .fail(function(err){
        console.log("La requête s'est terminée en échec. Infos : " + JSON.stringify(err));
    })
    .always(function(){
        console.log("Requête effectuée");
    });
}

// ******************   Fonction permettant de manipuler le memory   ******************
// Lance la barre de progression
function startProgressBar () {
    let value = 0;
    game.progressbar = setInterval(() => {
        $( '.progressbar' ).progressbar( "value", value++ );
    }, 1000);
}

// Permet de relancer une partie perdu
function loses () {
    clearInterval(game.progressbar);
    $('.startBtn').show();
    $('.startBtn').text('Perdu :( , recommencer ?');
}

// Affiche la fin du jeu
function gameOver () {
    $('.startBtn').text('Recommencer ?');
    $('.startBtn').show();
    const stopProgress = $(".progressbar").progressbar("value");
    clearInterval(game.progressbar);
    $('.yourScore').text('Félicitation ! Votre temps est de ' + stopProgress + ' secondes');
    $('.yourScore').show();
    setScore(stopProgress);
}

// Supprime les elements du tableau qui ont été trouvé
function removeItems (val) {
    game.newArray = game.newArray.filter(el => el != val);
}

// permet de passer l'affiche de la vignette du back au fronty
function flipper (el) {
    el.addClass('active');
    el.find('.back').show();
    el.find('.front').hide();
}

// En cas d'erreur sur la sélection de deux élements, lance la fonction "flipper" pour cacher les vignettes
function hideCard () {
    flipper(game.sel[0]);
    flipper(game.sel[1]);
    clearInterval(game.timer);
    game.sel = [];
    game.pause = false;
}

// Melange le tableau des vignettes 
function arrayRandomize (arr) {
    arr.sort(function () {
        return .5 - Math.random();
    });
}

// Se lance au clique sur "Démarrer" pour afficher le jeu et jouer
function startGame () {
    $('.startBtn').hide();
    $('.yourScore').hide();
    $('.progressbar').show();
    startProgressBar();
    game.pause = false;
    game.sel = [];
    game.newArray = boxes.concat(boxes);    // Duplique les éléments du tableau "boxes"
    arrayRandomize(game.newArray);      // Melange le tableau des vignettes 
    $('.game').html('');

    // Boucle permettant de créer une vignette pour chaque élément du nouveau tableau
    $.each(game.newArray, function (key, value) {
        let box = $('<div>');
        box.addClass('box active');     // Nous permet d'identifier les vignettes cliquables (qui n'affiche pas le fruit) car les fruit ne doivent pas être cliquables.
        box.data('cnt', key + 1);
        box.data('val', value);

        // partie de la vignette qui affiche l'index dans le tableau
        let back = $('<div>');
        back.addClass('back');
        back.html(key + 1);
        box.append(back);

        // partie de la vignette qui affiche le fruit dans le tableau
        let front = $('<div>');
        let img = `<img class="img" src="./img/${value}" alt="${value}" />`;
        $(front).append(img);
        front.addClass('front');
        box.append(front);

        //  Injecter les vignettes dans la div avec la class "game"
        $('.game').append(box);
    })
}

// ******************   Fonction JQUERY   ******************
// Se lance dès que la page est chargé pour récupérer le meilleur score et affiche le texte du bouton
$(document).ready(() => {
    getBestScore();
    $('.startBtn').text('Démarrer');
    $('.yourScore').hide();
})

// Parametre par défault de la barre de progression avec la valeur maximum ainsi que la fonction si se déclenche si la valeur est atteinte
$( '.progressbar' ).progressbar({
    max: 180,
    complete: function () {
        loses();
    }
});

// Fontion qui lance le jeu au clic sur "Démarrer"
$('.startBtn').click(startGame);


$('.game').on('click', '.active', function (event) {
    // Verifie si le jeu n'est pas en pause
    if (!game.pause) {

        // envoi l'element cliqué dans la sélection, supprime la classe active du box et affiche le fruit
        game.sel.push($(this));
        $(this).removeClass('active');
        $(this).find('.back').hide();
        $(this).find('.front').show();

        // vérifie si la sélection contient 2 éléments  
        if (game.sel.length === 2) {
            // Compare les 2 elements, si ce sont les mêmes les élements vont être supprimer sinon les vignettes se cachent 
            if (game.sel[0].data('val') == game.sel[1].data('val')) {
                game.pause = false;
                removeItems(game.sel[0].data('val'));
                game.sel = [];
                // si il n'y a plus d'élément dans le tableau, l'utilisateur à gagner
                if (game.newArray.length == 0 ) {
                    gameOver();
                }
            } else {
                game.pause = true;
                game.timer = setInterval(hideCard, 500);
            }
        }
    }
})
