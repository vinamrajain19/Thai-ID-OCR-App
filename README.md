 # Thai ID OCR App

This React application uses Tesseract.js for OCR (Optical Character Recognition) of Thai ID cards. It allows users to upload an image of a Thai ID card, extract the relevant information, and save it to a database. The app also includes a filter feature to search for specific OCR records.

# Demo

https://github.com/vinamrajain19/Thai-ID-OCR-App/assets/91343225/301582a1-43fc-40c0-9105-cf2046c74c03

o

## Prerequisites

- Node.js and npm
- Tesseract.js (version 5 or higher) (Earlier I wanted to use Google Vision API but it is paid means we have to pay i.e prepayment option)
- ImageJS (version 2 or higher)
- A backend server with a REST API to handle OCR data (e.g., Express.js)

## Setup

1. Clone the repository.
2. Go to the Server folder and install the dependencies:
```
cd server
npm install
```
3. Run the React app:
```
cd client
npm start
```

## How to Use

1. Drag and drop an image of a Thai ID card onto the dropzone, or click to select one.
2. The app will automatically process the image and extract the relevant information.
3. The extracted fields will be displayed in the "Extracted Fields" section.
4. You can edit the extracted fields if needed.
5. Click the "Save" button to save the extracted data to the database.
6. You can also filter the OCR history by name or identification number.


### Added Functionality 

Also added remove filters functionality but when I recorded the video it was not there, I added it afterward.

### Issue

There is a small issue, when we use search with filters functionality in the application, it does not work properly but this issue is on the deployed version only. When we are running it locally, the search functionality is working properly. The issue is with the production code of react-dom on render (on which I have deployed my application). In the demo video, I am running the application locally and in this search functionality is working fine.

So this issue is: 
```

TypeError: s.map is not a function
    at Hp (App.js:313:25)
    at So (react-dom.production.min.js:167:137)
```

