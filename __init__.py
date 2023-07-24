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
   
    audio_file = open(audio_path, "rb")
    #return audio_path
    transcript = openai.Audio.transcribe("whisper-1", audio_file)

    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {
        "role": "system",
        "content": "You will be provided with a sentence in spanish, and your task is to translate it into english."
        },
        {
        "role": "user",
        "content":  transcript['text']
        }
    ],
    temperature=0,
    max_tokens=256
    )

    transcribe= transcript['text']
    traduction=  response["choices"][0]["message"]["content"]
    #concat transcribe , break line and traduction
    return traduction
    return  transcribe + '\n' + traduction

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
    static_folder = os.path.join(os.path.dirname(__file__), 'static')
    static_folder= os.path.join(static_folder, 'audios')
    audio_file.save(os.path.join(static_folder, filename))
    return {"status": "File saved."}, 200

# transcribe audio file
# return transcript
# recieve audio file name   
@app.route('/transcribe', methods=['POST'])
def transcribe():
# get id from json request
    id = request.json['id']
    #get full path of audio file
    audio_path = os.path.join(os.path.dirname(__file__), 'static')
    audio_path = os.path.join(audio_path, 'audios')
  
    audio_path = os.path.join(audio_path, id + '.mp3')
    


    # get transcript
    transcript = transcribeaudio(audio_path)
    # return json response
    return {"transcript": transcript}, 200



   

# get all audio files
@app.route('/getaudios', methods=['GET'])
def getaudios():
    # get full path of audio files

        # Get the path to the "static" folder
    static_folder = os.path.join(os.path.dirname(__file__), 'static')
    static_folder= os.path.join(static_folder, 'audios')
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
