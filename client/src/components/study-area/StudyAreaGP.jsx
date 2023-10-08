import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navbar } from '../navbar/logged_navbar/navbar';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
// import './ExpandableCollapsible.css';

export const StudyAreaGP = (props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { id } = useParams();
  const groupNameId = id;

  const { UserId, categoryFor } = props;
  const categoryForToLower = categoryFor.toLowerCase();
  const categoryForToUpper = categoryFor.toUpperCase();

  const [showLesson, setShowLesson] = useState(true);
  const [showMCQAs, setShowMCQAs] = useState(false);
  const [showRev, setShowRev] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [studyMaterialsCategory, setSudyMaterialsCategory] = useState([]);
  const [lastMaterial, setLastMaterial] = useState(null);
  const [materialMCQ, setMaterialMCQ] = useState({});
  const [materialRev, setMaterialRev] = useState({});
  const [materialMCQChoices, setMaterialMCQChoices] = useState([]);
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialCategories, setMaterialCategories] = useState([]); 

  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({}); 

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  

  useEffect(() => {
    
    const reloadParamExists = searchParams.has('reload');

    if (reloadParamExists) {    
      window.location.reload();
      navigate(`/main/group/study-area/${id}`)
    }

    let studyMaterialCatPersonalLink = '';
    let studyMaterialPersonalLink = '';
    let studyLastMaterialLink = '';

    if (categoryFor === 'Personal') {
      studyMaterialCatPersonalLink = `http://localhost:3001/studyMaterialCategory/${categoryFor}/${UserId}`;

      studyMaterialPersonalLink = `http://localhost:3001/studyMaterial/study-material-category/${categoryFor}/${UserId}`;
    } else {
      studyMaterialCatPersonalLink = `http://localhost:3001/studyMaterialCategory/${categoryFor}/${groupNameId}/${UserId}`;

      studyMaterialPersonalLink = `http://localhost:3001/studyMaterial/study-material-category/${categoryFor}/${groupNameId}/${UserId}`;
    }


    axios.get(studyMaterialCatPersonalLink).then((response) => {
      setMaterialCategories(response.data);
    });

    axios.get(studyMaterialPersonalLink).then((response) => {
      let sortedData = response.data.sort((a, b) => b.id - a.id);
      setSudyMaterialsCategory(sortedData);

      const lastMaterial = sortedData.length > 0 ? sortedData[0] : null;
      setLastMaterial(lastMaterial);

      if (
        lastMaterial &&
        lastMaterial.StudyMaterialsCategoryId &&
        categoryFor &&
        UserId
      ) {
        let studyLastMaterialLink;

        if (categoryFor === 'Personal') {
          studyLastMaterialLink = `http://localhost:3001/studyMaterialCategory/get-lastmaterial/${lastMaterial.StudyMaterialsCategoryId}/${categoryFor}/${UserId}`;
        } else {
          studyLastMaterialLink = `http://localhost:3001/studyMaterialCategory/get-lastmaterial/${lastMaterial.StudyMaterialsCategoryId}/${groupNameId}/${categoryFor}/${UserId}`;
        }

        axios
          .get(studyLastMaterialLink)
          .then((response) => {
            if (response.data && response.data.category) {
              setMaterialCategory(response.data.category);
            } else {
              console.log('Category not found in the response data');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        console.error(
          'Missing required data for constructing the URL and making the request'
        );
      }

      if (lastMaterial) {
        axios
          .get(`http://localhost:3001/quesAns/study-material-mcq/${lastMaterial.id}`)
          .then((response) => {
            setMaterialMCQ(response.data);

            if (Array.isArray(response.data)) {
              const materialChoices = response.data.map((materialChoice) => {
                return axios.get(
                  `http://localhost:3001/quesAnsChoices/study-material/${lastMaterial.id}/${materialChoice.id}`
                );
              });

              Promise.all(materialChoices)
                .then((responses) => {
                  const allChoices = responses.map((response) => response.data).flat();
                  setMaterialMCQChoices(allChoices);
                })
                .catch((error) => {
                  console.error('Error fetching data:', error);
                });
            }
          })
          .catch((error) => {
            console.error('Error fetching study material by ID:', error);
          });

        axios
          .get(`http://localhost:3001/quesRev/study-material-rev/${lastMaterial.id}`)
          .then((response) => {
            setMaterialRev(response.data);
          })
          .catch((error) => {
            console.error('Error fetching study material by ID:', error);
          });
      }
    });

    const initialExpandedState = {};
    materialCategories.forEach((category) => {
      initialExpandedState[category.id] = true;
    });
    setExpandedCategories(initialExpandedState);
  }, [UserId, categoryFor, groupNameId, navigate]);

  const choicesById = {};

  materialMCQChoices.forEach((choice) => {
    if (!choicesById[choice.QuesAnId]) {
      choicesById[choice.QuesAnId] = [];
    }
    choicesById[choice.QuesAnId].push(choice.choice);
  });

  const showContent = (contentNumber) => {
    setActiveButton(contentNumber);
    // Hide all divs first
    setShowLesson(false);
    setShowMCQAs(false);
    setShowRev(false);

    // Show the selected div
    if (contentNumber === 1) {
      setShowLesson(true);
    } else if (contentNumber === 2) {
      setShowMCQAs(true);
    } else if (contentNumber === 3) {
      setShowRev(true);
    }
  };

  const toggleExpandId = (categoryId) => {
    setExpandedCategories((prevExpandedCategories) => ({
      ...prevExpandedCategories,
      [categoryId]: !prevExpandedCategories[categoryId], // Toggle the state
    }));
  };


  return (
    <div className="poppins mcolor-900 flex justify-start items-start">
      {/* Side */}
      <div className={`flex flex-col justify-between min-h-[100vh] w-1/4 p-5 sidebar mbg-300 mcolor-900`}>
        <div className="my-5 shelf-categories">
          <p className="text-2xl mb-10 font-bold text-center opacity-90">{categoryForToUpper} SHELF</p>
          <div>
            <div>
              <span>{categoryFor === 'Personal' ? 'My' : 'Our'} Study Material</span>
              <button onClick={toggleExpand} className='ml-2'>{!isExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}</button>
            </div>
            <div className={`expandable-container ${isExpanded ? 'expanded' : ''}`}>
              {materialCategories.length > 0 ? (
                isExpanded && materialCategories.map((category) => (
                <div className="shelf-category my-5" key={category.id}>
                  <div className="shadows mbg-100 mt-2 mcolor-900 p-4 rounded-[5px]">
                    <div className='flex items-center'>
                      <div className="text-lg font-medium">{category.category}</div>
                      <button onClick={() => toggleExpandId(category.id)} className='ml-2'>
                        {!expandedCategories[category.id] ? (
                          <i className="fa-solid fa-chevron-down"></i>
                        ) : (
                          <i className="fa-solid fa-chevron-up"></i>
                        )}
                      </button>
                    </div>
                    {/* Check if the category is expanded before rendering the study materials */}
                    <div>
                      
                    </div>
                    {expandedCategories[category.id] && (
                      studyMaterialsCategory
                        .filter((material) => material.StudyMaterialsCategoryId === category.id)
                        .map((material, index) => (
                          <p key={index} className='mt-2'>
                            <i className="fa-solid fa-book mr-2"></i>
                            {material.title}
                          </p>
                        ))
                    )}
                    {expandedCategories[category.id] && studyMaterialsCategory
                      .filter((material) => material.StudyMaterialsCategoryId === category.id)
                      .length === 0 && (
                        <p className='text-center mt-2'>No study material under this category</p>
                      )}
                  </div>
                </div>
                ))
              ) : (
                <p className='text-center'>No materials saved.</p>
              )}
            </div>
          </div>

          {/* <div>
            <div>
              <span>{categoryFor === 'Personal' ? 'My' : 'Our'} Bookmarks</span>
              <button onClick={toggleExpand} className='ml-2'>{!isExpanded ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-chevron-up"></i>}</button>
            </div>
          </div> */}
        </div>
      </div>

      <div className='py-6 px-10 w-3/4 '>
        <Navbar linkBack={`/main/${categoryForToLower}/`} linkBackName={`${categoryFor} Study Area`} currentPageName={'Study Area'} username={'Jennie Kim'}/>

        <Link to={`/main/${categoryForToLower}/study-area/qa-gen/${categoryFor === 'Group' ? groupNameId : ''}`}>
          <button className='my-10 rounded-[8px] px-6 py-2 font-medium font-lg mbg-800 mcolor-100'>Create Reviewer</button>
        </Link>

        <div>
          {lastMaterial !== null && (
            <div className='relative'>
              <p className='text-xl mcolor-900 mb-3'>Latest Uploaded Reviewer: {lastMaterial.title} from {materialCategory}</p>

              <section className="border scroll-box max-h-[63vh]">
                <div className='gap-2 flex justify-between items-start'>
                  <button
                    onClick={() => showContent(1)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 1 ? '' : 'mbg-300'}`}
                  >
                    Lesson
                  </button>
                  {/* <button
                    onClick={() => showContent(2)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 2 ? '' : 'mbg-300'}`}
                  >
                    Questions and Answers
                  </button> */}
                  <button
                    onClick={() => showContent(3)}
                    className={`w-full py-3 text-lg rounded-[5px] font-medium ${activeButton === 3 ? '' : 'mbg-300'}`}
                  >
                    Notes Reviewer
                  </button>
                </div>
                <div className='p-10'>
                  {showLesson && lastMaterial && <div>{lastMaterial.body}</div>}
                  {/* {showMCQAs && materialMCQ && (
                    <div>
                      {materialMCQ.map((material) => (
                        <div className='mb-10' key={material.id}>
                          <p className='my-2 mcolor-900 font-bold'>{material.question}</p>
                          <p className='font-medium'>Answer: <span className='text-emerald-500'>{material.answer}</span></p>
                          <ul>
                            {materialMCQChoices.filter((choice) => choice.QuesAnId === material.id).map((choice, index) => (
                              <li key={index}>{choice.choice}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )} */}
                  {showRev && materialRev && (
                    <div>
                      {materialRev.map((material) => (
                        <div className='mb-10'>
                          <p className='my-1 mcolor-900 font-bold'>{material.question}</p>
                          <p className='font-medium mcolor-700'>Answer: <span className='mcolor-900 font-medium'>{material.answer}</span></p>
                        </div>
                      ))}
                      <div className='mb-[-1.5rem]'></div>
                    </div>
                  )}
                </div>
              </section>
              <div className='flex items-center justify-end absolute right-0 bottom-[-.8rem]'>
                <Link to={`/main/${categoryForToLower}/study-area/group-review/${groupNameId}/${lastMaterial.id}`} className='mbg-800 mcolor-100 rounded-[5px] px-12 py-2'>View Reviewer</Link>
                {/* /main/group/study-area/group-review/ */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
