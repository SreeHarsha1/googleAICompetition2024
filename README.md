# googleAICompetition2024
# Food Inspector App

# Backend
Node JS = Go to inside parent folder, go to nodejs folder, fill in the envs for http,https port, api key etc as per your needs, do npm i, do npm start or node index.js

there is a retry mechanisams for 500 errors from gemini api

Android Studio: 

 open res/values/strings.xml

 change host,port and scheme values based on where you want to send the request from android studio to the node js server endpoint

# FrontEnd

MAKE SURE THAT BACKEND IS UP AND RUNNING IN THE PORTS THAT FRONTEND IS SENDING REQUESTS TO
## Description
Food Inspector is an Android application that [brief description of what your app does].

## Requirements
- Minimum SDK Version: 
- Target SDK Version: 31 (Android 12)
- Camera: Optional (not required, but used if available)

## Permissions
This app requires the following permissions:
- Camera access
- Internet access
- Read media images

## Setup and Installation #######################################################################
1. Clone the repository
2. Open the project in Android Studio
3. Build and run the app on an Android device or emulator

## File Provider
The app includes a FileProvider for sharing files. The authority is `[your.package.name].fileprovider`.

## Network Security
The app is configured to use cleartext traffic. Note that this is not recommended for production apps and should be used cautiously.
