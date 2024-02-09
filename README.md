Extension setup:
1. Clone repo: `git clone https://github.com/Dark-Pattern/React-Extension-New.git`
2. Go into the folder React-Extension-New: `cd React-Extension-New`
3. Install Dependencies inside this folder : `npm install`
4. Build the extension using command: `npm run dev`(It will run only one time) or `npm run watch`(To automatically build after saving any changes)
5. A new folder named dist will be generated.
6. upload this `dist` folder in google chrome (this folder is similar to `chrome` folder in the old extension`

   Frontend
1. `src/popup/popup.jsx` is the entry point, i.e the main react component file.
2. `src/popup/popup.css` is the css file which is imported in `popup.jsx`.




`Optional: to start the server you will need to setup node-server and python-server. But without starting server also you can run the extension and change the frontend of the popup.`

   Node Server Link: (Read readme of node-server to setup node server)
   `http://localhost:5000`

   Python Server Link: (Read readme of python-server to setup node server)
   `http:/localhost:3000`
