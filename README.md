# Speech Translator Chat

## Project Overview
Speech Translator Chat is a real-time speech recognition and translation application built using Django and WebSockets. The frontend is developed with HTML, Bootstrap, and JavaScript, while the backend is powered by Django Channels to handle real-time WebSocket connections.

---

## Project Structure
```
Speech-Translator-Chat/
├── venv/                 # Virtual environment
├── frontend/             # Frontend files
│   ├── index.html        # Main HTML file
│   ├── js/               # JavaScript directory
│   │   ├── main.js       # JavaScript logic for WebSockets and API calls
├── chatproject/          # Django project directory
│   ├── chatapp/          # Django application
│   │   ├── consumers.py  # WebSocket Consumers
│   │   ├── routing.py    # WebSocket routing
│   ├── chatproject/      # Inner project directory
│   │   ├── asgi.py       # ASGI configuration
│   │   ├── settings.py   # Django settings
│   ├── manage.py         # Django management script
├── requirements.txt      # Dependencies
├── README.md             # Documentation
```

---

## Setting Up the Project
### 1. Clone the Repository
```sh
$ git clone https://github.com/yourusername/speech-translator-chat.git
$ cd speech-translator-chat
```

### 2. Create a Virtual Environment
```sh
$ python -m venv venv
```

### 3. Activate the Virtual Environment
- **Windows:**
  ```sh
  $ venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```sh
  $ source venv/bin/activate
  ```

### 4. Install Dependencies
```sh
$ pip install -r requirements.txt
```

---

## Configuring the Django Project
### 5. Apply Migrations
Navigate to the `chatproject` directory and run:
```sh
$ cd chatproject
$ python manage.py migrate
```

### 6. Create a Superuser (Optional)
If you need access to the Django admin panel:
```sh
$ python manage.py createsuperuser
```
Follow the prompts to set up a username and password.

---

## Running the Server
### 7. Start the Django Development Server
```sh
$ python manage.py runserver
```
The server will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Running the WebSocket Server
This project uses Django Channels and ASGI. Run the following command:
```sh
$ daphne -b 127.0.0.1 -p 8000 chatproject.asgi:application
```

---

## Running the Frontend
### 8. Open `index.html`
Navigate to the `frontend/` directory and open `index.html` in a browser.
```sh
$ cd frontend
$ open index.html  # For macOS
$ start index.html  # For Windows
$ xdg-open index.html  # For Linux
```

---

## WebSocket Connection
- The WebSocket connection is established in `main.js`:
  ```js
  const socket = new WebSocket("ws://127.0.0.1:8000/ws/speech/");
  ```
- The backend WebSocket logic is handled in `chatapp/consumers.py`.

---

## Deployment
### 9. Collect Static Files
Before deployment, collect static files:
```sh
$ python manage.py collectstatic
```

### 10. Set Allowed Hosts in `settings.py`
Modify the `ALLOWED_HOSTS` variable:
```python
ALLOWED_HOSTS = ['yourdomain.com', '127.0.0.1']
```

---

## Conclusion
Your Speech Translator Chat project is now set up and running. You can expand it by integrating authentication, improving UI, and adding more languages for translation. 🚀

