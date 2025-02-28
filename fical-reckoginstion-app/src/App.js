import { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [isAuth, setIsAuth] = useState(false);

  const sendImage = async (e) => {
    e.preventDefault();

    if (!image) {
      setUploadResultMessage('Please upload an image first.');
      setIsAuth(false);
      return;
    }

    try {
      const base64Image = await toBase64(image);

      const response = await fetch('https://lk2kxxh0nb.execute-api.us-east-1.amazonaws.com/dev/employee', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();

      if (data?.Message === 'Success') {
        setIsAuth(true);
        setUploadResultMessage(`Hi ${data.firstName} ${data.lastName}, Welcome to work! Have a productive day!`);
      } else {
        setIsAuth(false);
        setUploadResultMessage('Authentication failed. This person is not an employee.');
      }
    } catch (error) {
      setIsAuth(false);
      setUploadResultMessage('Error during authentication. Please try again.');
      console.error('Error:', error);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="app">
      <div className="left-column">
        <h1>Serverless Image Processing Security</h1>

        <form onSubmit={sendImage}>
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose Image
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">Authenticate</button>
        </form>

        <div className={`message ${isAuth ? 'success' : 'failure'}`}>{uploadResultMessage}</div>
      </div>

      <div className="right-column">
        {image && <img src={URL.createObjectURL(image)} alt="visitor" className="visitor-image" />}
      </div>
    </div>
  );
}

export default App;