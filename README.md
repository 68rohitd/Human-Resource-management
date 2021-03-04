# Human Resource Management System 
[Application Demo](https://limitless-bastion-82171.herokuapp.com/#/)

One stop software to manage your employees

## Features

- Login/Register feature
- Integrated Payroll system
- Add, Edit, Delete employees
- Search and filter employees
- Apply for leaves, loans, bonus
- Manage your tickets all at one place
- Cool admin dashboard with statistics
- Add reminders directly to your google calender!

## Installation

1. clone this repository
2. cd into `Human-Resource-management` folder
3. run `npm install` to install server dependencies
4. cd into `client` folder
5. run `npm install` to install client dependencies
6. go to the root directory. ie `Human-Resource-management` folder
7. run `npm run dev` to run the client and server concurrently

## Note

`.env` file will be needed which contains API KEYS for various purposes. Following keys have been used:

- ATLAS_URI: (for connecting to the mongo db atlas database)
- JWT_SECRET: (for loggin in user)
- REACT_APP_NEWS: (for fetching news `https://gnewsapi.net`)
- GMAIL: (for sending email to the admin)
