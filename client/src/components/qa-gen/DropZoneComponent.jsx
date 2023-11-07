import React, { useContext, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import Axios from 'axios';
import { PDFDetails, GeneratedQAResult } from './QAGenerator';
import './studyArea.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const DropZoneComponent = (props) => {

  const { pdfDetails, setPDFDetails } = props;

  // context hooks
  // const { setPDFDetails } = useContext(PDFDetails);
  const { setGeneratedQA } = useContext(GeneratedQAResult);
  const { setNumInp, numInp } = props;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const url = 'http://127.0.0.1:8000/qa-generation';

  const [data, setData] = useState({
    text: PDFDetails,
    num_questions_inp: '',
  });

  async function handleInputChange(event) {
    const { id, value } = event.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
    setNumInp(parseInt(event.target.value, 10));
  }

  async function handleFileChange(file) {
    if (file) {
      extractPdfText(file);
    }
  }

  async function extractPdfText(file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const pdfContent = await getContent(e.target.result);
      setData((prevData) => ({ ...prevData, text: pdfContent }));
      setPDFDetails(pdfContent);
    };
    reader.readAsArrayBuffer(file);
  }

  async function getContent(src) {
    const doc = await pdfjs.getDocument(src).promise;
    const totalNumPages = doc.numPages;
    let allContent = '';

    for (let pageNumber = 1; pageNumber <= totalNumPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      allContent += content.items.map((item) => item.str).join(' ');
    }

    return allContent;
  }

  async function submit(event) {
    event.preventDefault();
  
    // Add validation here to check if both input fields are empty
    if (!data.text && !data.num_questions_inp) {
      return; // Exit the function if both input fields are empty
    }
  
    try {
      const response = await Axios.post(url, {
        text: pdfDetails,
        num_questions_inp: data.num_questions_inp,
      });

      setGeneratedQA(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  // form drag and drop function 

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('active');
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('active');

    const file = event.dataTransfer.files[0];
    handleFileChange(file);
  }


  // loader function
  const Loader = ({ loading, progress }) => {
    return (
      <div className={`loader ${loading ? 'active' : ''}`}>
        <div className="mt-4 text-center text-lg font-medium progress-bar">
          {progress}%
        </div>
      </div>
    );
  };
  

  const intervalRef = useRef(null); // Declare the interval using useRef
  const handleGenerateClick = async (event) => {
    event.preventDefault();
  
    
    const animationDurationInSeconds = numInp * 2 + 5;
    setLoading(true);
  
    clearInterval(intervalRef.current); // Clear any previous interval
  
    setProgress(0); // Reset progress to 0
  
    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / animationDurationInSeconds);
        
        if (newProgress <= 100) {
          return parseFloat(newProgress.toFixed(2)); // Limit to 2 decimal places
        } else {
          setLoading(false);
          clearInterval(intervalRef.current);
          return 100; // Cap progress at 100
        }
      });
    }, 1300); // Set interval to update every 0.9 seconds
  
    try {
      // Call the API submit function
      await submit(event);
    } catch (error) {
      console.error(error);
    }
  };
  

  
  

  return (
    <div>
      
      <form className="pdf-form" onSubmit={submit}>
        <div className="form-group">
          <div
            id="drop-area"
            className="drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('pdf_upload').click()}
          >
            <p>Drag and drop a PDF file here, or click to select one.</p>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e.target.files[0])}
            id="pdf_upload"
            style={{ display: 'none' }}
            required
          />
        </div>

        <div className="form-group">
        <input
          required
          type="number"
          onChange={handleInputChange}
          id="num_questions_inp"
          value={numInp}
          placeholder="Maximum number of items"
          name="num_questions_inp"
          className='maxnum bg-transparent'
          min="1"
          max="500"
        />
        </div>

        {/* <button type="submit" className="generate-btn mbg-700">
          Generate
        </button> */}

        {/* Button with disabled attribute */}
        <button
          className="generate-btn"
          onClick={handleGenerateClick}
          disabled={loading || (loading ||
            !data.num_questions_inp ||
            !data.text )}
          style={{
            backgroundColor: loading ? 'gray' : '#4D5F6E',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            
          }}
          >
          Generate
        </button>
        {loading && data.text && data.num_questions_inp && <Loader loading={loading} progress={progress} />}
      </form>


    </div>
  );
};
