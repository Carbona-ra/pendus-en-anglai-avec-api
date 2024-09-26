async function obtenirMotAleatoire() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        
        if (data && data[0]) {
            return data[0].toLowerCase();  // Retourne le mot obtenu en minuscules
        } else {
            throw new Error('Aucun mot reçu de l\'API');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du mot :', error);
        return null;  // Retourne null en cas d'erreur
    }
}

class JeuxDuPendule {

    constructor() {
        this.mot = '';  // Mot à deviner
        this.lettreDonner = document.getElementById('letter');
        this.wordContainer = document.getElementById('word-container');
        this.subButton = document.getElementById('subButton');
        this.resetButton = document.getElementById('resetButton'); // Bouton de réinitialisation
        this.score = document.getElementById('score');
        this.vie = 10;
        this.correctGuesses = 0;
        
        this.subButton.addEventListener('click', () => this.wordVerification());
        this.resetButton.addEventListener('click', () => this.initGame()); // Ajout de l'événement au bouton reset

        this.initGame(); // Démarre le jeu au début
    }

    async initGame() {
        this.vie = 10;
        this.correctGuesses = 0;
        this.score.textContent = this.vie;
        this.lettreDonner.value = '';  // Remettre à zéro l'input

        // Choisir un mot aléatoire en utilisant l'API
        this.mot = await obtenirMotAleatoire();
        if (this.mot) {
            this.affichCase();
        } else {
            alert('Impossible de récupérer un mot, veuillez réessayer.');
        }
    }

    affichCase() {
        this.wordContainer.innerHTML = ''; 

        for (let i = 0; i < this.mot.length; i++) {
            const listItem = document.createElement('div');
            listItem.id = 'lettre' + i;
            listItem.textContent = '_';
            listItem.classList.add('letter');
            this.wordContainer.appendChild(listItem);
        }
    }

    wordVerification() {
        const lettre = this.lettreDonner.value.toLowerCase();
        this.lettreDonner.value = '';  // Efface le champ après l'entrée

        if (lettre.length !== 1) {
            alert('Entrez une seule lettre');
            return;
        }

        let lettreTrouvee = false;

        for (let i = 0; i < this.mot.length; i++) {
            if (this.mot[i] === lettre) {
                const div = document.getElementById('lettre' + i);
                if (div.textContent === '_') {  // Ne met à jour que si la lettre n'a pas encore été trouvée
                    div.textContent = lettre;
                    this.correctGuesses++;
                }
                lettreTrouvee = true;
            }
        }

        if (!lettreTrouvee) {
            this.perdreVie();
        } else if (this.correctGuesses === this.mot.length) {
            alert('Bravo ! Vous avez gagné !');
            this.revelerMot();
        }
    }

    perdreVie() {
        this.vie--;
        this.score.textContent = this.vie;

        if (this.vie === 0) {
            alert('Désolé, vous avez perdu !');
            this.revelerMot(true);
        } else {
            alert('Lettre incorrecte, vous perdez une vie');
        }
    }

    revelerMot(perdu = false) {
        for (let i = 0; i < this.mot.length; i++) {
            const div = document.getElementById('lettre' + i);
            div.textContent = this.mot[i];
            if (perdu) div.style.color = 'red';  // Affiche les lettres en rouge si la partie est perdue
        }
    }
}

const jeu = new JeuxDuPendule();
