import requests
import io
import base64
import env

from requests.adapters import HTTPAdapter, Retry
def postImg(): 
    
    imagePath = "metal.png"
    imageFile = open(imagePath, "rb")

    imageBytes = base64.b64encode(imageFile.read())
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)

    response = session.post("http://192.168.1.7/detect",
		data=imageBytes)
    # response = requests.post(
	# 	"http://192.168.1.7/detect",
	# 	data=imageBytes
	# )
    print("Response received!")
    response_data = response.json()
    print(response_data)
    

            
def main():
    postImg()

if __name__ == '__main__':
    main()