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

  const handleFileChange = async (file) => {
    if (file) {
      await extractPdfText(file);  // Wait for the text extraction to complete
      resetState();
    }
  };

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

  const Loader = ({ loading, progress }) => {
    return (
      <div className={`loader ${loading ? 'active' : ''}`}>
        <div className="mt-4 text-center text-lg font-medium progress-bar">
          {progress}%
        </div>
      </div>
    );
  };

  const intervalRef = useRef(null);
  const handleGenerateClick = async (event) => {
    event.preventDefault();

    const animationDurationInSeconds = numInp * 2 + 5;
    setLoading(true);

    clearInterval(intervalRef.current);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / animationDurationInSeconds);

        if (newProgress <= 100) {
          return parseFloat(newProgress.toFixed(2));
        } else {
          setLoading(false);
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
      setIsRegenerate(true)
    } catch (error) {
      console.error(error);
    }
  };

  const resetState = () => {
    setPDFDetails('');
    setData({
      text: '',
      num_questions_inp: '',
    });
    setNumInp(0);
    setLoading(false);
    setGeneratedQA({});
    setProgress(0);
  };

  useEffect(() => {

  }, [pdfDetails])

  return (
    <div>
      <form className="pdf-form">
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
          <input
            required
            type="number"
            onChange={handleInputChange}
            id="num_questions_inp"
            value={numInp}
            placeholder="Maximum number of items"
            name="num_questions_inp"
            className="maxnum bg-transparent"
            min="1"
            max="500"
          />
        </div>
        {(!isRegenerate) ? (
          <button
            className="generate-btn"
            disabled={loading || !data.num_questions_inp || !data.text}
            style={{
              backgroundColor: loading ? 'gray' : '#4D5F6E',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : '',
            }}
            onClick={(event) => handleGenerateClick(event)}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        ) : (
          <div className='flex items-center justify-center gap-3'>
            <button
              className="generate-btn"
              disabled={loading || !data.num_questions_inp || !data.text}
              style={{
                backgroundColor: loading ? 'gray' : '#4D5F6E',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : '',
              }}
              onClick={(event) => handleGenerateClick(event)}
            >
              {loading ? 'Regenerating...' : 'Regenerate'}
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


        {loading && data.text && data.num_questions_inp && <Loader loading={loading} progress={progress} />}
      </form>
    </div>
  );
};
