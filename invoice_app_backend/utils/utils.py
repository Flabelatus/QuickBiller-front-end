import json
import requests

creds = {
    "email": "jooshesh.javid@gmail.com",
    "password": "123"
}

r = requests.post("http://localhost:5005/login", data=json.dumps(creds),
                  headers={"Content-Type": "application/json"})

auth = json.loads(r.content)["access_token"]

data = requests.get("http://localhost:5005/user_company", headers={
    "Content-Type": "application/json",
    "Authorization": "Bearer " + auth
})

print(data.json())
