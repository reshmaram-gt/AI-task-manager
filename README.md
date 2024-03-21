# Project Name

An AI-powered chatbot application to manage user's tasks.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This application uses an AI chatbot to make API calls to the backend system setup using Django.

## Features

- **Register:** Users can register when they first visit the website.
- **Login:** Returning users can log in to the site.
- **Authentication:** Only logged-in users can access the chatbot.
- **Chatbot:** Users can use the chatbot to create, edit, delete, or view their own tasks.

## Installation

    pip install -r requirements.txt

## Usage

### Backend Setup

1. Navigate to the `testProject` directory:

    ```bash
    cd testProject
    ```

2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```
3. Navigate to 'crudapp/views.py'

   Replace `OPENAI_API_KEY' with your_api_key 

4. From root 'testProject' directly, apply migrations:

    ```bash
    python manage.py migrate
    ```

4. Run the development server:

    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```
2. If required:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

- Visit [http://localhost:3000/](http://localhost:3000/) to interact with the app and chatbot.
- Swagger API Documentation: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)

### To Run Docker Container
1. Navigate to 'testProject/testProject/settings.py'
    In DATABASES details, change "HOST" to "db"
2. From 'testProject/testProject', run
    ```bash
    docker-compose build
    ```
3.     ```bash
    docker-compose up
    ```
4. Visit [http://localhost:3000/](http://localhost:3000/) to interact with the app and chatbot.

## GitHub Links

- **Repository:** [https://github.com/reshmaram-gt/AI-task-manager](https://github.com/reshmaram-gt/AI-task-manager)
- **Pull Requests:** [https://github.com/reshmaram-gt/AI-task-manager/pull/4](https://github.com/reshmaram-gt/AI-task-manager/pull/4)
