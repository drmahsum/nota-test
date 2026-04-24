const notes = [
  { name: 'Do', y: 100, ledger: true, stem: 'stem-up' }, // Orta Do (C4)
  { name: 'Re', y: 90, ledger: false, stem: 'stem-up' }, // Re (D4)
  { name: 'Mi', y: 80, ledger: false, stem: 'stem-up' }, // Mi (E4)
  { name: 'Fa', y: 70, ledger: false, stem: 'stem-up' }, // Fa (F4)
  { name: 'Sol', y: 60, ledger: false, stem: 'stem-up' }, // Sol (G4)
  { name: 'La', y: 50, ledger: false, stem: 'stem-up' },  // La (A4)
  { name: 'Si', y: 40, ledger: false, stem: 'stem-down' }, // Si (B4)
  { name: 'Do', y: 30, ledger: false, stem: 'stem-down' }, // İnce Do (C5)
  { name: 'Re', y: 20, ledger: false, stem: 'stem-down' }, // İnce Re (D5)
  { name: 'Mi', y: 10, ledger: false, stem: 'stem-down' }, // İnce Mi (E5)
  { name: 'Fa', y: 0, ledger: false, stem: 'stem-down' },  // İnce Fa (F5)
  { name: 'Sol', y: -10, ledger: false, stem: 'stem-down' } // İnce Sol (G5)
];

// Olasılığı artırmak için es'i diziye biraz daha ekleyebiliriz veya olduğu gibi bırakabiliriz
// Şu an için 1/13 ihtimalle çıkacak

let currentNote = null;
let score = 0;
let isAnimating = false;

const noteDisplayBox = document.getElementById('note-display');
const scoreLabel = document.getElementById('score');
const feedbackMsg = document.getElementById('feedback-message');
const buttons = document.querySelectorAll('.ans-btn');

function initGame() {
    score = 0;
    updateScore();
    nextQuestion();
}

function updateScore() {
    scoreLabel.innerText = score;
}

function nextQuestion() {
    let newNote = notes[Math.floor(Math.random() * notes.length)];
    // Aynı sorunun üst üste gelmesini engelle
    while (currentNote === newNote) {
        newNote = notes[Math.floor(Math.random() * notes.length)];
    }
    currentNote = newNote;
    displayNote(currentNote);
}

function displayNote(note) {
    noteDisplayBox.innerHTML = '';
    
    // Smooth hareket için transition zaten CSS'te tanımlı
    // Opaklığı anlık 0 yapıp yerleştikten sonra 1 yapabiliriz (isteğe bağlı)
    
    if (note.type === 'rest') {
        noteDisplayBox.style.top = note.y + 'px';
        noteDisplayBox.innerHTML = '<div class="rest-symbol">&#119069;</div>';
    } else {
        noteDisplayBox.style.top = note.y + 'px';
        let head = document.createElement('div');
        head.className = `note-head ${note.stem}`;
        if (note.ledger) {
            head.classList.add('ledger-line');
        }
        noteDisplayBox.appendChild(head);
    }
}

buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (isAnimating) return; // Animasyon sırasında çift tıklamayı engelle
        
        const guess = e.target.getAttribute('data-note');
        checkAnswer(guess, e.target);
    });
});

function checkAnswer(guess, btnElement) {
    if (guess === currentNote.name) {
        // Doğru cevap!
        score += 10;
        updateScore();
        feedbackMsg.innerText = 'DOĞRU!';
        feedbackMsg.className = 'feedback-message show-correct';
        btnElement.classList.add('correct');
        
        isAnimating = true;
        setTimeout(() => {
            btnElement.classList.remove('correct');
            feedbackMsg.className = 'feedback-message';
            isAnimating = false;
            nextQuestion();
        }, 800);
        
    } else {
        // Yanlış cevap!
        score -= 5;
        if (score < 0) score = 0;
        updateScore();
        feedbackMsg.innerText = 'YANLIŞ!';
        feedbackMsg.className = 'feedback-message show-wrong';
        btnElement.classList.add('wrong');
        
        isAnimating = true;
        setTimeout(() => {
            btnElement.classList.remove('wrong');
            feedbackMsg.className = 'feedback-message';
            isAnimating = false;
        }, 600);
    }
}

// Oyunu başlat
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});
