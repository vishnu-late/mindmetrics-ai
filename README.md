

````markdown
# 🧠 MindMetrics AI

### ML-Powered Student Mental Health Score Prediction

MindMetrics AI is an end-to-end Machine Learning web application that predicts a student's mental health score based on academic, lifestyle, stress, sleep, physical activity, and social media usage factors.

The project demonstrates how a Machine Learning model can be developed, evaluated, integrated with a FastAPI backend, connected to a web frontend, and deployed as a live application.

---

## 🚀 Live Demo

🌐 **Live Application:**  
https://mindmetrics-aiml.netlify.app
https://mindmetrics-ai-4.onrender.com

⚡ **Backend API:**  
https://mindmetrics-ai-b07k.onrender.com


📚 **API Documentation (Swagger):**  
https://mindmetrics-ai-b07k.onrender.com

🐙 **GitHub Repository:**  
https://github.com/vishnu-late/mindmetrics-ai

---

## 📌 Project Overview

MindMetrics AI uses Machine Learning to predict a student's mental health score from multiple academic, lifestyle, stress, and social media related factors.

The application allows users to enter student information through a web interface. The data is sent to a FastAPI backend, where the trained Machine Learning model generates the predicted score and returns the result to the frontend.

---

## 🎯 Objective

The main objectives of this project are:

- To analyze student academic and lifestyle factors.
- To study the relationship between social media usage and mental health-related patterns.
- To develop a Machine Learning regression model for score prediction.
- To deploy the trained model through a REST API.
- To build a user-friendly web interface for making predictions.
- To demonstrate a complete end-to-end Machine Learning deployment workflow.

---

## 🤖 Machine Learning Model

Multiple regression models were evaluated during the model development process.

### Selected Algorithm

**Random Forest Regressor**

The Random Forest model was selected based on its evaluation performance.

### 📊 Model Performance

| Metric   | Score      |
| R² Score | **87.76%** |
| MAE      | **0.347**  |
| RMSE     | **0.464**  |

> Since this is a regression problem, R² Score is used to evaluate model performance instead of classification accuracy.

---

## 📊 Input Features

The application uses the following student-related features:

- Age
- Gender
- Country
- Academic Level
- Most Used Social Media Platform
- Purpose of Social Media Usage
- Average Daily Usage Hours
- Daily Unlocks
- Study Hours
- Physical Activity Hours
- Sleep Hours Per Night
- Stress Level

---

## 🛠️ Tech Stack

### Machine Learning
- Python
- Pandas
- Scikit-learn
- Joblib
- Google Colab

### Backend
- FastAPI
- Pydantic
- Uvicorn
- REST API

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Deployment
- Render — Backend Deployment
- Netlify — Frontend Deployment

### Version Control
- Git
- GitHub

---

## 🔄 Project Workflow

```text
Student Input
      ↓
Data Validation
      ↓
FastAPI Backend
      ↓
Trained Random Forest Model
      ↓
Prediction
      ↓
Frontend Result
````

### Complete Development Flow

```text
Data Collection
      ↓
Data Preprocessing
      ↓
Exploratory Data Analysis
      ↓
Feature Engineering
      ↓
Model Training
      ↓
Model Evaluation
      ↓
Random Forest Selection
      ↓
FastAPI Integration
      ↓
Frontend Integration
      ↓
Cloud Deployment
```

---

## 🌐 System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │     Web Browser     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Netlify Frontend   │
                    │    HTML/CSS/JS      │
                    └──────────┬──────────┘
                               │
                         POST /predict
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Render Backend    │
                    │       FastAPI       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Random Forest Model │
                    │   ML Prediction     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Predicted Mental    │
                    │    Health Score     │
                    └─────────────────────┘
```

---

## ⚡ API

### Prediction Endpoint

**POST `/predict`**

The API accepts student information in JSON format and returns the predicted mental health score.

### Example Request

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.5,
  "daily_unlocks": 60,
  "study_hours": 5,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

### Example Response

```json
{
  "predicted_mental_health_score": 6.42
}
```

> The response value above is only an example to demonstrate the API format.

---

## 📁 Project Structure

```text
mindmetrics-ai/
│
├── backend/
│   └── main.py
│
├── data/
│   └── dataset files
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── notebooks/
│   └── Machine Learning notebooks
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## ☁️ Deployment

The project is deployed using separate frontend and backend services.

### Frontend

**Netlify**

The frontend provides the user interface and communicates with the backend API.

### Backend

**Render**

The FastAPI backend hosts the trained Machine Learning model and provides the prediction API.

### Deployment Flow

```text
GitHub
   │
   ├──────────────► Netlify
   │                 │
   │                 ▼
   │             Frontend
   │
   └──────────────► Render
                     │
                     ▼
                 FastAPI API
                     │
                     ▼
                ML Prediction
```

---

## 💡 Key Learning Outcomes

Through this project, I gained practical experience in:

* Data preprocessing
* Exploratory Data Analysis
* Feature engineering
* Regression model development
* Random Forest
* Model evaluation
* REST API development
* FastAPI
* Frontend and backend integration
* API testing
* Cloud deployment
* Git and GitHub
* End-to-end Machine Learning application development

---

## 🔮 Future Improvements

Potential future improvements include:

* Adding more advanced Machine Learning models.
* Improving model performance through additional feature engineering.
* Adding interactive data visualizations.
* Improving the user interface and user experience.
* Adding authentication and user management.
* Implementing model monitoring and versioning.
* Expanding the dataset for better generalization.

---

## ⚠️ Disclaimer

This project is developed for **educational and demonstration purposes only**.

The predicted score should **not** be considered a medical diagnosis, clinical assessment, or substitute for professional mental health advice.

---

## 👨‍💻 Author

### Vishnu Late

GitHub:
[https://github.com/vishnu-late/vishnu-late](https://github.com/vishnu-late/vishnu-late)

Project Repository:
[https://github.com/vishnu-late/mindmetrics-ai](https://github.com/vishnu-late/mindmetrics-ai)

---

## ⭐ Support

If you find this project interesting, feel free to explore the repository, try the live application, and give the project a ⭐ on GitHub.

---

### 🚀 Built with Python, Machine Learning, FastAPI, HTML, CSS & JavaScript

 link वापरण्याआधी ती तुझ्या actual profile URL शी match होतेय का check कर. बाकी README तुझ्या project details प्रमाणे तयार आहे.
```

