#from flask import Flask
#from flask import render_template
#
#app = Flask(__name__)
#
#@app.route('/')
#def hello_world():
#    return render_template('hello.html')
#
#if __name__ == "__main__":
#  app.run(debug=True)

import os
from flask import Flask, render_template, request, jsonify

import openai
openai.api_key = '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'

app = Flask(__name__)

def transcribeaudio(audio_path):
    
    return 'sample'
    audio_file = open(audio_path, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    print(transcript['text'])
    return transcript['text']

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/save_audio', methods=['POST'])
def save_audio():
    audio_file = request.files['audio']
    if audio_file:
        # Get the path to the "static" folder
        static_folder = os.path.join(os.path.dirname(__file__), 'static')
        
        # Save the audio file in the "static" folder
        audio_path = os.path.join(static_folder, 'recorded_audio.webm')
        audio_file.save(audio_path)
        transcript=transcribeaudio(audio_path)
        # Assuming you have already imported the necessary libraries for openai
        
        
        # You can return the transcript text along with the audio URL
        return jsonify({'audio_url': f'/static/recorded_audio.webm', 'transcript': transcript})
    
    return jsonify({'error': 'No audio data received'}), 400

if __name__ == '__main__':
    app.run(debug=True)
