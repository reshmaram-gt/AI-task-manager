# Use an official Python runtime as a parent image
FROM python:3.9-alpine

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# create root directory for our project in the container

# Set the working directory to /testProject
WORKDIR /testProject

# Copy the current directory contents into the container at /testProject
COPY . .

# # Install any needed packages specified in requirements.txt
# COPY ./requirements.txt .
RUN python -m pip install psycopg2-binary
RUN pip install --no-cache-dir -r requirements.txt 

RUN ls


CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
