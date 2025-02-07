function updateSmiley(noiseLevel) {
    const smileyDiv = document.getElementById('smiley');
    const descriptionDiv = document.getElementById('description'); // Aggiungi questa riga
    let smiley;
    let description; // Variabile per la descrizione

    if (noiseLevel === 0) {
        smiley = '😀'; // Silenzio perfetto
        description = 'Silenzio perfetto'; // Descrizione
    } else if (noiseLevel <= 3) {
        smiley = '😉'; // Rumore accettabile
        description = 'Rumore accettabile'; // Descrizione
    } else if (noiseLevel <= 6) {
        smiley = '🤫'; // Rumore moderato
        description = 'Rumore moderato'; // Descrizione
    } else {
        smiley = '😡'; // Caos assoluto
        playAlarm(); // Riproduce segnali acustici
        description = 'PERICOLO SANZIONE DISCIPLINARE'; // Descrizione
        const msg = new SpeechSynthesisUtterance('Livello di caos raggiunto');
        window.speechSynthesis.speak(msg);
    }

    smileyDiv.innerText = smiley;
    descriptionDiv.innerText = description; // Aggiungi questa riga
}

function playAlarm() {
    const audio = new Audio('alarm.mp3'); // Assicurati di avere un file audio chiamato alarm.mp3
    audio.play();
    const msg = new SpeechSynthesisUtterance('Pericolo sanzione disciplinare');
    window.speechSynthesis.speak(msg);
}

// Richiesta di accesso al microfono
document.getElementById('startButton').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 2048;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function updateNoiseLevel() {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                updateSmiley(average / 25); // Normalizza il valore per il range 0-10
                requestAnimationFrame(updateNoiseLevel);
            }

            updateNoiseLevel(); // Avvia l'analisi
        })
        .catch(err => {
            console.error('Errore nell\'accesso al microfono: ', err);
        });
});