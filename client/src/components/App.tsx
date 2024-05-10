import { initializeApp } from "firebase/app";
import "../styles/App.css";
import Maps from "./HomePage";
import AuthRoute from "./auth/AuthRoute";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

initializeApp(firebaseConfig);

/**
 * Top level app function
 *
 * @returns the app
 */
function App() {
  return (
    <div className="App">
      <AuthRoute gatedContent={<Maps />} />
    </div>
  );
}

export default App;
