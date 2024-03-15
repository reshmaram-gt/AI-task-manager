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

3. Apply migrations:

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

2. Start the development server:

    ```bash
    npm start
    ```

3. Replace `OPENAI_API_KEY=your_api_key_here` in your environment variables.

- Visit [http://localhost:3000/](http://localhost:3000/) to interact with the app and chatbot.
- Swagger API Documentation: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)

## GitHub Links

- **Repository:** [https://github.com/reshmaram-gt/AI-task-manager](https://github.com/reshmaram-gt/AI-task-manager)
- **Pull Requests:** [https://github.com/reshmaram-gt/AI-task-manager/pull/4](https://github.com/reshmaram-gt/AI-task-manager/pull/4)
