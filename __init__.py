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




@app.route('/saveAudio', methods=['POST'])
def saveAudio():
    audio_file = request.files['audio']
    filename = audio_file.filename
    
        # Get the path to the "static" folder
    static_folder = os.path.join(os.path.dirname(__file__), 'static\\audios')
    audio_file.save(os.path.join(static_folder, filename))
    return {"status": "File saved."}, 200


# get all audio files
@app.route('/getaudios', methods=['GET'])
def getaudios():
    # get full path of audio files

    static_folder = os.path.join(os.path.dirname(__file__), 'static\\audios')

    # get all files in 'static/audios' folder
    files = os.listdir(static_folder)
    # for each file, preappend '/static/audios' to the filename 

    files = [f'/static/audios/{file}' for file in files]
    
    return {"files": files}, 200   

#get audio file by name
@app.route('/static/audio/<filename>', methods=['GET'])
def getaudio(filename):
    # get full path of audio files

    static_folder = os.path.join(os.path.dirname(__file__), 'static\\audios')

    # get all files in 'static/audios' folder
    files = os.listdir(static_folder)
    # for each file, preappend '/static/audios' to the filename 

    files = [f'/static/audios/{file}' for file in files]
    
    return {"files": files}, 200


if __name__ == '__main__':
    app.run(debug=True)
