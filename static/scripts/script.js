let isPulsating = false;

function togglePulsatingEffect() {
    const pulsatingCircle = document.querySelector('.pulsating-circle');
    const microphoneIcon = document.querySelector('.microphone-icon');
    const dotIcon = document.querySelector('.dot-icon');
    if (isPulsating) {
        pulsatingCircle.classList.remove('active');
        pulsatingCircle.style.backgroundColor = 'white';
        microphoneIcon.style.color = 'black';
        microphoneIcon.style.display = 'block';
        dotIcon.style.display = 'none';
        isPulsating = false;
        stopRecording();
    } else {
        pulsatingCircle.classList.add('active');
        pulsatingCircle.style.backgroundColor = 'red';
        dotIcon.style.color = 'white';
        microphoneIcon.style.display = 'none';
        dotIcon.style.display = 'block';
        isPulsating = true;
        startRecording();
    }
}


// document.querySelectorAll('.transcript-btn').forEach(function(button) {
//     button.addEventListener('click', function() {
//         const transcriptText = button.parentElement.nextElementSibling.querySelector('.transcript-text');
//         const ipaText = transcriptText.parentElement.nextElementSibling.querySelector('.ipa-text');
//         const metadata = button.previousElementSibling; // get the metadata element
//         transcriptText.textContent = 'Transcription text goes here';
//         ipaText.textContent = 'IPA equivalent goes here';
//         metadata.textContent = 'Metadata goes here'; // add the metadata
//     });
// });


let mediaRecorder;
let recordedChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = function(e) {
            recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
            let blob = new Blob(recordedChunks, {
                type: 'audio/mp3'
            });
            let url = URL.createObjectURL(blob);
            recordedChunks = [];
            let timestamp = new Date().toISOString();
            //replace all non-alphanumeric characters with dashes including colons and periods
            timestamp = timestamp.replace(/[^a-zA-Z0-9]/g, '-');
         
            appendCard(timestamp, url);
            // call saveRecording() here   
            saveRecording(timestamp);
   

            
        };
    })
    .catch(err => {
        console.error('getUserMedia() failed: ', err);
    });
}

//function to append card to container
function appendCard(id, url=null) {

    if(url==null){
        url='/static/audios/'+id+'.mp3';

    }
    if(id==null){
        // get id from url
        id=url.split('/').pop().split('.')[0];
    }
    let card = $('<div/>', { class: 'card' }).append(
        $('<div/>', { class: 'audio-row' }).append(
            $('<audio/>', { controls: '' }).append(
                $('<source/>', { src: url, type: 'audio/mpeg', id: id }),

                
                'Your browser does not support the audio element.'
            ),
            $('<p/>', { class: 'audio-metadata' }),
            $('<button/>', { class: 'transcript-btn', text: 'Transcript' })
            // $('<button/>', { class: 'transcript-btn', text: 'Transcript', click: showTranscript })
        ),
        $('<div/>', { class: 'transcript-row' }).append(
            $('<p/>', { class: 'transcript-text' })
        ),
        $('<div/>', { class: 'ipa-row' }).append(
            $('<p/>', { class: 'ipa-text' })
        )
    );
    
    $('.container').append(card);
}

//function to save recording to server
function saveRecording(id) {
    //get audio element by id attribute
    const audioElement = document.getElementById(id);   
    // Get the URL of the audio blob
    const url = audioElement.src;
    // send blob to server
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            // Create a new FormData instance
            let formData = new FormData();
            
            // Add the blob to the FormData instance
            formData.append('audio', blob, id+'.mp3');
            
            // Define the options for the fetch request
            let options = {
                method: 'POST',
                body: formData
            };
            
            // Send the POST request
            fetch('/saveAudio', options)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // The response data from the API should be handled here.
                    // This is where you would update the transcript and IPA fields.
                    const transcriptText = $(this).parent().next().find('.transcript-text');
                    const ipaText = transcriptText.parent().next().find('.ipa-text');
                    transcriptText.text(data.transcript); // Assuming the response data has a 'transcript' field
                    ipaText.text(data.ipa); // Assuming the response data has a 'ipa' field
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        );



}



function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder=null;
    }
}

function showTranscript_() {
    const audioElement = $(this).parent().find('audio source');
    const url = audioElement.attr('src'); // Get the URL of the audio blob
    console.log(url);
    // Fetch the blob data
    if(false)
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            // Create a new FormData instance
            let formData = new FormData();
            
            // Add the blob to the FormData instance
            formData.append('audio', blob, 'audio.mp3');
            
            // Define the options for the fetch request
            let options = {
                method: 'POST',
                body: formData
            };
            
            // Send the POST request
            fetch('https://your-api-endpoint', options)
                .then(response => response.json())
                .then(data => {
                    // The response data from the API should be handled here.
                    // This is where you would update the transcript and IPA fields.
                    const transcriptText = $(this).parent().next().find('.transcript-text');
                    const ipaText = transcriptText.parent().next().find('.ipa-text');
                    transcriptText.text(data.transcript); // Assuming the response data has a 'transcript' field
                    ipaText.text(data.ipa); // Assuming the response data has a 'ipa' field
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });


}

// funtion to get all audio from server
function getAudios() {
    fetch('/getaudios')
        .then(response => response.json())
        .then(data => {
            // The response data from the API should be handled here.
            // This is where you would update the transcript and IPA fields.
            console.log(data);
            data=data.files;
            for (let i = 0; i < data.length; i++) {
                appendCard(null,data[i]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// jquey function when transcript button is clicked
$(document).on('click', '.transcript-btn', function() {
    //get audio element next to button
    const audioElement = $(this).parent().find('audio source');
    const id = audioElement.attr('id'); // Get the id of the audio blob
    getTranscript(id);

});

//Get transcript from server sending audio id
function getTranscript(id) {
    fetch('/transcribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(data => {
            // get transcript from json
            transcript=data.transcript;
            console.log(transcript);
            // Obtener el elemento con el id "2023-07-24T03-03-34-197Z"
            const audioElement = document.getElementById(id);

            // Obtener el elemento "card" que contiene el elemento de audio
            const cardElement = audioElement.parentNode.parentNode.parentNode;
            // Obtener el elemento con la clase "transcript-text" dentro del "card"
            // el simbolo mayor que ">" indica que solo se debe buscar dentro del elemento "card"
            cardElement.querySelector('.transcript-row>.transcript-text').textContent=transcript;


            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(transcript);
            synth.speak(utterance);


        })
        .catch(error => {
            console.error('Error:', error);
        });
}


        
        
        /*
function showTranscript() {
    const audioElement = $(this).parent().find('audio source');
    const url = audioElement.attr('src'); // Get the URL of the audio blob

    // Fetch the blob data
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            // Create a new FormData instance
            let formData = new FormData();
            
            // Add the blob to the FormData instance
            formData.append('audio', blob, 'audio.mp3');
            
            // Define the options for the fetch request
            let options = {
                method: 'POST',
                body: formData
            };
            
            // Send the POST request
            fetch('/transcript', options)
                .then(response => response.json())
                .then(data => {
                    // The response data from the API should be handled here.
                    // This is where you would update the transcript and IPA fields.
                    const transcriptText = $(this).parent().next().find('.transcript-text');
                    const ipaText = transcriptText.parent().next().find('.ipa-text');
                    transcriptText.text(data.transcript); // Assuming the response data has a 'transcript' field
                    ipaText.text(data.ipa); // Assuming the response data has a 'ipa' field
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
}
*/

// init with getAudios
getAudios();



