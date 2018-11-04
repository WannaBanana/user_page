# room-reserve-calendar

## View
https://wannabanana.github.io/user_page/

## File structure
```
user_page
├─ gulpconfig.js
├─ gulpfile.js
├─ package.json
└─ source
       ├─ css
       ├─ equipment
       │    ├─ css
       │    ├─ img
       │    ├─ index.html
       │    └─ js
       ├─ img
       │    └─ account.png
       ├─ index.html
       ├─ js
       ├─ login
       │    ├─ css
       │    ├─ img
       │    ├─ index.html
       │    └─ js
       └─ room
              ├─ css
              ├─ img
              ├─ index.html
              └─ js
```

## Usage
### step1
```
git clone https://github.com/WannaBanana/user_page.git
npm install
```

### step2
This will build all files and start server at 8080 port
```
npm start 
```

This will build all files
```
npm run build
```

This will build all files and deploy the git page by pushing files to branch in gh-pages
```
npm run deploy
```

If there are some errors when using command of deploy, just like
```
TypeError: Cannot read property '0' of null...
```

try to use
```
cd node_modules/gulp-gh-pages/
npm install --save gift@0.10.2
cd ../../
gulp deploy
```

## Tools
- [Materializecss](https://materializecss.com/)
- [Fullcalendar](https://fullcalendar.io/)
- [Firebase](https://firebase.google.com)

## About
It's a project in class.
