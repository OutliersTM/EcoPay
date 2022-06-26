# Digital OCEAN FLASK SERVER RECEIVES IMAGE
from flask import Flask, request, jsonify
import classify
import base64
import json
import env
from firebase_admin import credentials,firestore,initialize_app,storage
from firebase_admin.firestore import SERVER_TIMESTAMP
import time

# Instantiate Flask
app = Flask(__name__)

# Initialize Firestore DB
cred = credentials.Certificate('./ecopaymlr-firebase-adminsdk-cgt1f-cad84caba6.json')
default_app = initialize_app(cred,{
    'storageBucket': 'ecopaymlr.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()
bucket = storage.bucket("ecopaymlr.appspot.com",default_app)

# health check
@app.route('/status')
def health_check():
    return 'Running!'


# Performing image Recognition on Image, sent as bytes via POST payload
@app.route('/detect', methods=["POST"])
def detect():

    imgBytes = request.data

    imgdata = base64.b64decode(imgBytes)
    with open("temp.png", 'wb') as f:
        f.write(imgdata)

    print("successfully receieved image")
    
    # Pass image bytes to classifier
    result = classify.analyse("temp.png")
    img = open("temp.png", "rb")

    # Return results as neat JSON object, using 
    result = jsonify(result)
    print(result.json)

    response_data = result.json
    print(response_data)
    
    #need to find user id from the bin using key or fingerprint scanner
    # add resposnse data to firestore database
    m_result = 0
    m_material = ""
    
    ts = time.time()
    
    for key in response_data:
        if response_data[key] > m_result:
            m_result = response_data[key]
            m_material = key
    
    blob = bucket.blob("images/"+str(ts)+".png")
    blob.upload_from_file(img, content_type='image/png')
    time.sleep(1)
    blob.make_public()
    p_url = blob.public_url
    db.collection(u"users").document(u'f2aO8nuPhoORfUFlbYsPL5B0CB52').collection(u"wastes").add({
        u'pred':response_data,
        u'timestamp':SERVER_TIMESTAMP,
        u'reward':m_result*10,
        u'material':m_material,
        u'image':p_url
    })
    
    
    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
