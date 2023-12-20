import React, { useContext, useEffect, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import Axios from 'axios';
import { PDFDetails, GeneratedQAResult } from './QAGenerator';
import './studyArea.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const DropZoneComponent = (props) => {
  const { pdfDetails, setPDFDetails } = props;
  const { setGeneratedQA } = useContext(GeneratedQAResult);
  const { setNumInp, numInp } = props;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRegenerate, setIsRegenerate] = useState(false)
  const [showLoading, setShowLoading] = useState(false);


  // link here
  const url = 'http://127.0.0.1:8000/qa-generation';

  const [data, setData] = useState({
    text: PDFDetails,
    num_questions_inp: null,
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
    if (event.target.value !== null) {
      setNumInp(parseInt(event.target.value, 10));
    }
  };

  const handleFileChange = async (file) => {
    if (file) {
      try {
        const pdfContent = await extractPdfText(file);
        setData((prevData) => ({ ...prevData, text: pdfContent }));
        setPDFDetails(pdfContent);
      } catch (error) {
        console.error('Error processing PDF file:', error);
        // Handle the error, e.g., display an error message to the user
      }
    }
  };

  const extractPdfText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const pdfContent = await getContent(e.target.result);
          resolve(pdfContent);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const getContent = async (src) => {
    const doc = await pdfjs.getDocument(src).promise;
    const totalNumPages = doc.numPages;
    let allContent = '';

    for (let pageNumber = 1; pageNumber <= totalNumPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      allContent += content.items.map((item) => item.str).join(' ');
    }

    return allContent;
  };

  const intervalRef = useRef(null);
  const handleGenerateClick = async (event) => {
    event.preventDefault();

    if (numInp === 0) {
      alert('Maximum number of items to generate cannot be 0.');
    } else {
      const animationDurationInSeconds = numInp * 2 + 5;
      setLoading(true);
      setShowLoading(true);

      clearInterval(intervalRef.current);
      setProgress(0);

      intervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + (100 / animationDurationInSeconds);

          if (newProgress <= 100) {
            return parseFloat(newProgress.toFixed(2));
          } else {
            clearInterval(intervalRef.current);
            return 100;
          }
        });
      }, 1300);

      try {
        const isRegenerate = progress === 100;
        const response = await Axios.post(url, {
          text: isRegenerate ? data.text : pdfDetails,
          num_questions_inp: isRegenerate ? data.num_questions_inp : numInp,
        });

        setGeneratedQA(response.data);
        setIsRegenerate(true);
        setShowLoading(false);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };


  const resetState = () => {
    window.location.reload()
  };
  
  
  useEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);



  useEffect(() => {

    if (pdfDetails === '') {
      setPDFDetails('');
    }

  }, [pdfDetails, setPDFDetails])

  return (
    <div className='w-full '>
      <form className="pdf-form px-16">
      <div className="form-group">
      <div
        id="drop-area"
        className="drop-area"
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.classList.add('active');
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.classList.remove('active');
          const file = event.dataTransfer.files[0];
          handleFileChange(file);
        }}
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
          <p className='mb-1 mt-10'>Maximum number of items to generate:</p>
          <input
            required
            type="number"
            onChange={handleInputChange}
            id="num_questions_inp"
            value={numInp}
            placeholder="Optional"
            className="maxnum bg-transparent"
            min="1"
            max="150"
          />
        </div>
        
        {(!isRegenerate) ? (
          <button
            className="generate-btn mt-2"
            disabled={loading || !data.text}
            style={{
              background: loading
                ? `linear-gradient(90deg, gray ${progress}%, gray ${progress}%)`
                : '#4D5F6E',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: showLoading ? 'not-allowed' : '',
              width: '100%', // Set the width to 100% to fill the container
              transition: 'background 0.3s', // Add a transition for a smoother effect
              opacity: loading || progress <= 100 ? 1 : 0, // Add opacity for fade-in effect
              position: 'relative',
            }}
            onClick={(event) => handleGenerateClick(event)}
          >
            {showLoading ? (
              <div className="flex items-center justify-center">
                <span style={{ marginRight: '1rem' }}>Generating</span>
                <div className="dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span style={{ marginRight: '1rem' }}>Generate</span>
              </div>
            )}
          </button>


        ) : (
          <div className='flex items-center justify-center gap-3'>
          <button
            className="generate-btn"
            disabled={loading || !data.text}
            style={{
              background: loading
                ? `linear-gradient(90deg, gray ${progress}%, gray ${progress}%)`
                : '#4D5F6E',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: showLoading ? 'not-allowed' : '',
              width: '100%', // Set the width to 100% to fill the container
              transition: 'background 0.3s', // Add a transition for a smoother effect
              opacity: loading || progress <= 100 ? 1 : 0, // Add opacity for fade-in effect
              position: 'relative',
            }}
            onClick={(event) => {
              setGeneratedQA({})
              handleGenerateClick(event)
            }}
          >
            {showLoading ? (
              <div className="flex items-center justify-center">
                <span style={{ marginRight: '1rem' }}>Regenerating</span>
                <div className="dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span style={{ marginRight: '1rem' }}>Regenerate</span>
              </div>
            )}
          </button>
            <button
              className="generate-btn"
              disabled={loading || !data.num_questions_inp || !data.text}
              style={{
                backgroundColor: loading ? '#D9E1E7' : '#D9E1E7',
                color: '#444',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'solid 2px #4D5F6E',
                cursor: loading ? 'not-allowed' : '',
              }}
              onClick={resetState}
            >
              Reset
            </button>
          </div>
        )}


      </form>
    </div>
  );
};
