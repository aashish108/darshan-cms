# Intro
This is a CMS platform that is designed to help ISKCON-London, a charity organisation, help out with their daily tasks. Its to support the photographer upload raw photos and allow the processer to process the photos and upload to the many channels.

## Current Workflow Pre-CMS
The actual task, that is done daily, is to upload photos that is given from their photographer from their Temple altar to:

* Their website via the Joomla CMS
* Facebook profile
* Twitter account
* Android/iOS app

We have 2 people involved in this service. The photographer and the processor who processses the raw photos and uploading them to our several channels.

## Start of this Project
I realised that this could all be automated or at least made a lot easier.

# App Overview
This CMS is designed to:
* Allow user login with different levels of access
* Upload raw photos
* Allow the processor to download raw photos
* Upload processed photos to the CMS side
* Upload latest photos to Twitter/Facebook/website
* Have API endpoints to supply the latest processed photos to the mobile app and the website

# Tech Stack
* Node.js
* Express.js framework
* PUG templating engine
* Mocha/Chai testing frameworks
* Gulp
* Docker - Dockerized the app for easy deployment/management
* MongoDB via Mongoose
* GitHub Actions CI/CD to build and deploy to the host via a self-hosted runner

# Front-end Side
This project is the CMS back-end side. For the website, my plan is to create a React app that will consume the API endpoints from this CMS and create a gallery of images that can switch between today and yesterdays.

# Install
TBD

# To Do
* Look into React/Redux
