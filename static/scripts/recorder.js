// recorder.js
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const audioPlayer = document.getElementById('audioPlayer');
const transcriptDiv = document.getElementById('transcript');
let mediaRecorder;
let chunks = [];

recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop; // Set onstop event handler here
            mediaRecorder.start();
            recordBtn.style.display = 'none';
            stopBtn.style.display = 'inline';
        })
        .catch(err => alert('Error accessing microphone:', err));
}

function stopRecording() {
    mediaRecorder.stop();
    recordBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
}

function handleDataAvailable(event) {
    chunks.push(event.data);
}

function handleStop(event) {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    chunks = [];
    const formData = new FormData();
    formData.append('audio', blob);
    fetch('/save_audio', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        audioPlayer.src = data.audio_url;
        audioPlayer.style.display = 'block';
        
        transcriptDiv.innerHTML = data.transcript;
        transcriptDiv.style.display = 'block';

    })
    .catch(err => console.error('Error saving audio:', err));
}
