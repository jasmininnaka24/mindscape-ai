import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../../../components/sidebar/Sidebar";

// icons import
import LabelIcon from "@mui/icons-material/Label";

// responsive sizes
import { useResponsiveSizes } from "../../../components/useResponsiveSizes";

// other imports
import { LibraryComponent } from "../../../components/library/LibraryComponent";

export const VirtualLibraryMain = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const {
    groupList,
    personalStudyMaterials,
    personalStudyMaterialsCategory,
    groupStudyMaterials,
    groupStudyMaterialsCategory,
    sharedMaterials,
    sharedMaterialsCategory,
    sharedMaterialsCategoryUsers,
    sharedMaterialsCategoryBookmarks,
    currentMaterialTitle,
    currentMaterialCategory,
    setCurrentMaterialCategory,
    materialMCQ,
    materialMCQChoices,
    materialNotes,
    currentSharedMaterialIndex,
    setCurrentSharedMaterialIndex,
    filteredSharedCategories,
    filteredStudyMaterialsByCategory,
    setFilteredStudyMaterialsByCategory,
    currentFilteredCategory,
    currentFilteredCategoryUsers,
    currentFilteredCategoryBookmarks,
    groupNameValue,
    setGroupNameValue,
    searchValue,
    setSearchValue,
    searchCategoryValue,
    setSearchCategoryValue,
    searchedMaterials,
    searchCategory,
    searchCategoryUsers,
    searchCategoryBookmarks,
    searchedCategories,
    showModal,
    setShowModal,
    showPresentStudyMaterials,
    setShowPresentStudyMaterials,
    showMaterialDetails,
    setShowMaterialDetails,
    enableBackButton,
    showBookmarkModal,
    setShowBookmarkModal,
    chooseRoom,
    setChooseRoom,
    chooseGroupRoom,
    setChooseGroupRoom,
    showCreateGroupInput,
    setShowCreateGroupInput,
    showContext,
    setShowContext,
    context,
    showNotes,
    setShowNotes,
    showQuiz,
    setShowQuiz,
    isDone,
    setIsDone,
    deleteModal,
    setDeleteModal,
    setMaterialIdToRemove,
    setMaterialIdToRemoveBookmarkCounts,
    buttonLoading,
    buttonLoader,
    buttonLoaderIndex,
    currentMaterial,
    buttonClickedNumber,
    btnClicked,
    toggledCategory,
    setToggledCategory,
    UserId,
    userData,
    fetchData,
    getUserData,
    toggleCategory,
    viewStudyMaterialDetails,
    shareMaterial,
    bookmarkMaterial,
    filterMaterial,
    handleSearchChange,
    handleCategorySearch,
    createGroupBtn,
    removeFromLibraryOnly,
    deleteInAllRecords,
    loading,
  } = LibraryComponent();

  useEffect(() => {
    if (!isDone) {
      setIsDone(true);
    }
  }, [UserId]);

  useEffect(() => {
    if (isDone) {
      getUserData();
      fetchData();
      setIsDone(false);
    }
  }, [isDone]);

  if (loading) {
    return (
      <div className="h-[100vh] w-full flex items-center justify-center">
        <div class="loader">
          <div class="spinner"></div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="poppins mcolor-900 mbg-200 relative flex">
          {/* <Navbar linkBack={'/main/'} linkBackName={'Main'} currentPageName={'Virtual Library Room'} username={'Jennie Kim'}/> */}

          <Sidebar currentPage={"library"} />

          <div
            className={`h-[100vh] flex flex-col items-center justify-between py-2 ${
              extraLargeDevices && "w-1/6"
            } mbg-800`}
          ></div>

          <div
            className={`flex-1 my-5 py-8 ${extraSmallDevice ? "px-3" : "px-8"}`}
          >
            <p
              className={`${
                extraSmallDevice || smallDevice
                  ? "text-xl w-full"
                  : "text-3xl  w-2/3"
              } font-medium`}
            >
              <LabelIcon fontSize="large" className="mcolor-800-opacity" />{" "}
              Virtual Library Room
            </p>

            {/* <div className='border-hr my-5'></div>   */}

            <div className="mt-8 gap-8 w-full flex">
              <div
                className={`${
                  extraLargeDevices || largeDevices ? "w-2/3" : "w-full"
                }`}
              >
                <div
                  className={`w-full flex items-center justify-end mb-4 ${
                    (extraLargeDevices || largeDevices) && "hidden"
                  }`}
                >
                  <button
                    onClick={toggleCategory}
                    className="mcolor-500 font-bold"
                  >
                    Categories
                  </button>
                </div>

                <div
                  className={`mbg-800 gap-3 px-4 rounded mcolor-100 flex ${
                    extraSmallDevice ? "flex-col" : "flex-row"
                  } py-3 items-center justify-between w-full`}
                >
                  <div className={`${extraSmallDevice ? "w-full" : "w-1/2"}`}>
                    <div className="border-medium-800 rounded">
                      <input
                        type="text"
                        placeholder="Search for material..."
                        className={`w-full py-2 rounded text-center mcolor-900 mbg-200 ${
                          extraSmallDevice ? "text-sm" : "text-md"
                        }`}
                        value={searchValue !== "" ? searchValue : ""}
                        onChange={(event) => {
                          handleSearchChange(event.target.value);
                          setSearchValue(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className={`${extraSmallDevice ? "w-full" : "w-1/2"}`}>
                    <button
                      className={`btn-primary py-2 w-full rounded ${
                        extraSmallDevice ? "text-sm" : "text-md"
                      }`}
                      onClick={() => {
                        setShowModal(true);
                        setShowPresentStudyMaterials(true);
                      }}
                    >
                      Share a Study Material
                    </button>
                  </div>
                </div>

                <div
                  className={`${
                    !extraSmallDevice &&
                    "flex flex-row justify-between items-center"
                  } mt-8`}
                >
                  <p
                    className={`font-medium ${
                      extraSmallDevice ? "text-sm" : "text-lg"
                    } mb-2`}
                  >
                    Latest Shared Study Materials:
                  </p>

                  {(filteredStudyMaterialsByCategory.length !== 0 ||
                    searchValue !== "") && (
                    <div
                      className={`${
                        extraSmallDevice && "w-full flex justify-end"
                      }`}
                    >
                      <button
                        className={`btn-800 rounded px-4 py-1 my-3 ${
                          extraSmallDevice ? "text-sm" : "text-md"
                        }`}
                        onClick={() => {
                          setFilteredStudyMaterialsByCategory([]);
                          setSearchValue("");
                        }}
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`grid ${
                    extraLargeDevices || largeDevices || mediumDevices
                      ? "grid-cols-2"
                      : "grid-cols-1"
                  } gap-3`}
                >
                  {/* delete modal */}
                  {deleteModal && (
                    <div
                      className={`absolute top-0 modal-bg left-0 w-full h-full`}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div
                          className={`relative mbg-input min-h-[30vh] ${
                            extraLargeDevices || largeDevices
                              ? "w-1/3"
                              : mediumDevices
                              ? "w-1/2"
                              : smallDevice
                              ? "w-2/3"
                              : "w-full mx-2"
                          } z-10 relative py-5 px-5 rounded-[5px]`}
                          style={{ overflowY: "auto" }}
                        >
                          <button
                            className="absolute right-5 top-5 font-medium text-xl"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteModal(false);
                            }}
                          >
                            &#10006;
                          </button>

                          <div className="flex items-center justify-center h-full">
                            <div className="w-full">
                              <div>
                                <div className="flex flex-col gap-4">
                                  <br />
                                  <button
                                    className="btn-300 py-4 rounded text-md font-medium"
                                    onClick={removeFromLibraryOnly}
                                  >
                                    {btnClicked &&
                                    currentMaterial === "Removing"
                                      ? "Removing..."
                                      : "Remove From Library Only"}
                                  </button>
                                  <button
                                    className="btn-300 py-4 rounded text-md font-medium"
                                    onClick={() => {
                                      deleteInAllRecords();
                                    }}
                                  >
                                    {btnClicked &&
                                    currentMaterial === "Deleting"
                                      ? "Deleting..."
                                      : "Delete in All Records"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {filteredStudyMaterialsByCategory &&
                    filteredStudyMaterialsByCategory.length === 0 &&
                    searchValue === "" &&
                    // Create an array of objects with material information and timestamp of the latest bookmark
                    sharedMaterials
                      .map((material, index) => {
                        const category =
                          sharedMaterialsCategory[index]?.category ||
                          "Category not available";
                        const user =
                          sharedMaterialsCategoryUsers[index]?.username ||
                          "Deleted user";
                        const bookmarks =
                          sharedMaterialsCategoryBookmarks[index] || [];

                        // Find the latest bookmark timestamp or default to 0 if no bookmarks
                        const latestBookmarkTimestamp = Math.max(
                          ...bookmarks.map((bookmark) => bookmark.timestamp),
                          0
                        );

                        return {
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount: bookmarks.length,
                          latestBookmarkTimestamp,
                        };
                      })
                      // Sort the array by the latest bookmark timestamp in descending order
                      .sort(
                        (a, b) =>
                          b.latestBookmarkTimestamp - a.latestBookmarkTimestamp
                      )
                      .map(
                        ({
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount,
                        }) => (
                          <div
                            key={index}
                            className={`my-3 mbg-input border-thin-800 p-4 rounded flex ${
                              extraLargeDevices || largeDevices || smallDevice
                                ? "flex-row justify-between"
                                : "justify-center flex-col"
                            } items-center`}
                          >
                            <div
                              className={`${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "w-2/3"
                                  : "w-full"
                              }`}
                            >
                              <p
                                className={`font-medium ${
                                  extraSmallDevice ? "text-md" : "text-lg"
                                }`}
                              >
                                Title:{" "}
                                <span className="font-medium">
                                  {material?.title}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Category:{" "}
                                <span className="font-medium mcolor-800">
                                  {category}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Uploader:{" "}
                                <span className="font-medium mcolor-800">
                                  {user}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Bookmark Count:{" "}
                                <span className="font-medium mcolor-800">
                                  {bookmarksCount}
                                </span>
                              </p>
                            </div>

                            <div
                              className={`gap-3 ${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "flex-1"
                                  : extraSmallDevice
                                  ? "w-full flex flex-col mt-5"
                                  : "w-full flex mt-3"
                              }`}
                            >
                              {user === userData?.username && (
                                <div
                                  className={`mbg-100 ${
                                    extraSmallDevice ? "py-2" : "my-1 py-1"
                                  } w-full mcolor-900 border-red-dark text-sm rounded`}
                                >
                                  <button
                                    className={`w-full text-red ${
                                      mediumDevices ? "text-xs" : "text-sm"
                                    }`}
                                    onClick={() => {
                                      if (bookmarksCount > 0) {
                                        alert(
                                          "This material has been bookmarked by others. You can no longer remove nor delete it."
                                        );
                                      } else {
                                        setDeleteModal(true);
                                        setMaterialIdToRemove(material.id);
                                        setMaterialIdToRemoveBookmarkCounts(
                                          bookmarksCount
                                        );
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}

                              <button
                                className={`mbg-200 ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } w-full mcolor-900 border-thin-800 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                disabled={buttonLoader}
                                onClick={() =>
                                  viewStudyMaterialDetails(
                                    index,
                                    "shared",
                                    "not filtered",
                                    category
                                  )
                                }
                              >
                                {buttonLoader && index === buttonLoaderIndex ? (
                                  <div className="w-full flex items-center justify-center">
                                    <div className="btn-spinner"></div>
                                  </div>
                                ) : (
                                  <div className="w-full">View</div>
                                )}
                              </button>

                              <button
                                className={`mbg-800-opacity w-full ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } mcolor-100 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                onClick={() => {
                                  setShowBookmarkModal(true);
                                  setChooseRoom(true);
                                  setCurrentSharedMaterialIndex(index);
                                }}
                              >
                                Bookmark
                              </button>
                            </div>
                          </div>
                        )
                      )}

                  {filteredStudyMaterialsByCategory &&
                    filteredStudyMaterialsByCategory.length > 0 &&
                    searchValue === "" &&
                    filteredStudyMaterialsByCategory
                      .map((material, index) => {
                        const category = currentFilteredCategory;
                        const user =
                          currentFilteredCategoryUsers[index]?.username ||
                          "Deleted user";
                        const bookmarks =
                          currentFilteredCategoryBookmarks[index] || []; // Ensure bookmarks is an array

                        // Find the latest bookmark timestamp or default to 0 if no bookmarks
                        const latestBookmarkTimestamp = Math.max(
                          ...bookmarks.map((bookmark) => bookmark.timestamp),
                          0
                        );

                        return {
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount: bookmarks.length,
                          latestBookmarkTimestamp,
                        };
                      })
                      // Sort the array by the latest bookmark timestamp in descending order
                      .sort(
                        (a, b) =>
                          b.latestBookmarkTimestamp - a.latestBookmarkTimestamp
                      )
                      .map(
                        ({
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount,
                        }) => (
                          <div
                            key={index}
                            className={`my-3 mbg-input border-thin-800 p-4 rounded flex ${
                              extraLargeDevices || largeDevices || smallDevice
                                ? "flex-row justify-between"
                                : "justify-center flex-col"
                            } items-center`}
                          >
                            <div
                              className={`${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "w-2/3"
                                  : "w-full"
                              }`}
                            >
                              <p
                                className={`font-medium ${
                                  extraSmallDevice ? "text-md" : "text-lg"
                                }`}
                              >
                                Title:{" "}
                                <span className="font-medium">
                                  {material?.title}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Category:{" "}
                                <span className="font-medium mcolor-800">
                                  {category}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Uploader:{" "}
                                <span className="font-medium mcolor-800">
                                  {user}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Bookmark Count:{" "}
                                <span className="font-medium mcolor-800">
                                  {bookmarksCount}
                                </span>
                              </p>
                            </div>

                            <div
                              className={`gap-3 ${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "flex-1"
                                  : extraSmallDevice
                                  ? "w-full flex flex-col mt-5"
                                  : "w-full flex mt-3"
                              }`}
                            >
                              {user === userData?.username && (
                                <div
                                  className={`mbg-100 ${
                                    extraSmallDevice ? "py-2" : "my-1 py-1"
                                  } w-full mcolor-900 border-red-dark text-sm rounded`}
                                >
                                  <button
                                    className={`w-full text-red ${
                                      mediumDevices ? "text-xs" : "text-sm"
                                    }`}
                                    onClick={() => {
                                      if (bookmarksCount > 0) {
                                        alert(
                                          "This material has been bookmarked by others. You can no longer remove nor delete it."
                                        );
                                      } else {
                                        setDeleteModal(true);
                                        setMaterialIdToRemove(material.id);
                                        setMaterialIdToRemoveBookmarkCounts(
                                          bookmarksCount
                                        );
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}

                              <button
                                className={`mbg-200 ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } w-full mcolor-900 border-thin-800 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                disabled={buttonLoader}
                                onClick={() =>
                                  viewStudyMaterialDetails(
                                    index,
                                    "shared",
                                    "not filtered",
                                    category
                                  )
                                }
                              >
                                {buttonLoader && index === buttonLoaderIndex ? (
                                  <div className="w-full flex items-center justify-center">
                                    <div className="btn-spinner"></div>
                                  </div>
                                ) : (
                                  <div className="w-full">View</div>
                                )}
                              </button>

                              <button
                                className={`mbg-800-opacity w-full ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } mcolor-100 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                onClick={() => {
                                  setShowBookmarkModal(true);
                                  setChooseRoom(true);
                                  setCurrentSharedMaterialIndex(index);
                                }}
                              >
                                Bookmark
                              </button>
                            </div>
                          </div>
                        )
                      )}

                  {searchValue !== "" &&
                    searchedMaterials
                      .map((material, index) => {
                        const category =
                          searchCategory[index]?.category ||
                          "Category not available";
                        const user =
                          searchCategoryUsers[index]?.username ||
                          "Deleted user";
                        const bookmarks = searchCategoryBookmarks[index] || [];

                        return {
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount: bookmarks.length,
                        };
                      })
                      .filter(
                        ({ material, category, user, bookmarksCount }) =>
                          material?.title
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          category
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          user.toLowerCase().includes(searchValue.toLowerCase())
                      )
                      .map(
                        ({
                          index,
                          material,
                          category,
                          user,
                          bookmarksCount,
                        }) => (
                          <div
                            key={index}
                            className={`my-3 mbg-input border-thin-800 p-4 rounded flex ${
                              extraLargeDevices || largeDevices || smallDevice
                                ? "flex-row justify-between"
                                : "justify-center flex-col"
                            } items-center`}
                          >
                            <div
                              className={`${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "w-2/3"
                                  : "w-full"
                              }`}
                            >
                              <p
                                className={`font-medium ${
                                  extraSmallDevice ? "text-md" : "text-lg"
                                }`}
                              >
                                Title:{" "}
                                <span className="font-medium">
                                  {material?.title}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Category:{" "}
                                <span className="font-medium mcolor-800">
                                  {category}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Uploader:{" "}
                                <span className="font-medium mcolor-800">
                                  {user}
                                </span>
                              </p>
                              <p
                                className={`${
                                  extraSmallDevice ? "text-xs" : "text-sm"
                                } mt-1 mcolor-700`}
                              >
                                Bookmark Count:{" "}
                                <span className="font-medium mcolor-800">
                                  {bookmarksCount}
                                </span>
                              </p>
                            </div>

                            <div
                              className={`gap-3 ${
                                extraLargeDevices || largeDevices || smallDevice
                                  ? "flex-1"
                                  : extraSmallDevice
                                  ? "w-full flex flex-col mt-5"
                                  : "w-full flex mt-3"
                              }`}
                            >
                              {user === userData?.username && (
                                <div
                                  className={`mbg-100 ${
                                    extraSmallDevice ? "py-2" : "my-1 py-1"
                                  } w-full mcolor-900 border-red-dark text-sm rounded`}
                                >
                                  <button
                                    className={`w-full text-red ${
                                      mediumDevices ? "text-xs" : "text-sm"
                                    }`}
                                    onClick={() => {
                                      if (bookmarksCount > 0) {
                                        alert(
                                          "This material has been bookmarked by others. You can no longer remove nor delete it."
                                        );
                                      } else {
                                        setDeleteModal(true);
                                        setMaterialIdToRemove(material.id);
                                        setMaterialIdToRemoveBookmarkCounts(
                                          bookmarksCount
                                        );
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}

                              <button
                                className={`mbg-200 ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } w-full mcolor-900 border-thin-800 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                disabled={buttonLoader}
                                onClick={() =>
                                  viewStudyMaterialDetails(
                                    index,
                                    "shared",
                                    "not filtered",
                                    category
                                  )
                                }
                              >
                                {buttonLoader && index === buttonLoaderIndex ? (
                                  <div className="w-full flex items-center justify-center">
                                    <div className="btn-spinner"></div>
                                  </div>
                                ) : (
                                  <div className="w-full">View</div>
                                )}
                              </button>

                              <button
                                className={`mbg-800-opacity w-full ${
                                  extraSmallDevice ? "py-2" : "my-1 py-1"
                                } mcolor-100 ${
                                  mediumDevices ? "text-xs" : "text-sm"
                                } rounded`}
                                onClick={() => {
                                  setShowBookmarkModal(true);
                                  setChooseRoom(true);
                                  setCurrentSharedMaterialIndex(index);
                                }}
                              >
                                Bookmark
                              </button>
                            </div>
                          </div>
                        )
                      )}
                </div>
              </div>

              <div
                className={`${
                  extraSmallDevice || smallDevice || mediumDevices
                    ? `w-full fixed top-0 left-0 min-h-[100vh] mbg-100 py-10 px-5 ${toggledCategory}`
                    : "flex-1 min-h-[70vh] pl-5"
                }`}
                style={{ borderLeft: "solid #627271 2px" }}
              >
                <div
                  className={`${
                    (extraLargeDevices || largeDevices) && "hidden"
                  } w-full flex items-center justify-end mb-5 text-xl `}
                >
                  <button onClick={toggleCategory}>&#10006;</button>
                </div>

                <div className={`mbg-800 mcolor-100 py-5 px-4 rounded`}>
                  <p className="font-medium text-lg">Search for category: </p>
                  <div className="my-3 border-medium-800 rounded">
                    <input
                      type="text"
                      placeholder="Search for a category..."
                      className="w-full py-2 rounded text-center mbg-input mcolor-900"
                      value={
                        searchCategoryValue !== "" ? searchCategoryValue : ""
                      }
                      onChange={(event) => {
                        handleCategorySearch(event.target.value);
                        setSearchCategoryValue(event.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p
                    className={`font-medium ${
                      extraSmallDevice ? "text-sm" : "text-lg"
                    }`}
                  >
                    Categories:{" "}
                  </p>
                  {searchCategoryValue !== "" && (
                    <button
                      className={`btn-800 rounded px-4 py-1 ${
                        extraSmallDevice ? "text-sm" : "text-md"
                      }`}
                      onClick={() => {
                        setSearchCategoryValue("");
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                <div
                  className={`grid ${
                    extraSmallDevice
                      ? "grid-cols-1"
                      : mediumDevices
                      ? "grid-cols-3"
                      : "grid-cols-2"
                  } gap-3 my-3`}
                >
                  {searchCategoryValue === "" &&
                    filteredSharedCategories.map((material, index) => {
                      return (
                        <div
                          key={index}
                          className={`mbg-input border-thin-800 py-2 rounded flex items-center justify-center`}
                        >
                          <button
                            onClick={() => {
                              filterMaterial(material.category);
                              setSearchValue("");
                              setCurrentMaterialCategory(material.category);
                              setToggledCategory("hidden");
                            }}
                          >
                            {material.category}
                          </button>
                        </div>
                      );
                    })}

                  {searchCategoryValue !== "" &&
                    searchedCategories.map((material, index) => {
                      return (
                        <div
                          key={index}
                          className="mbg-200 border-thin-800 py-2 rounded flex items-center justify-center"
                        >
                          <button
                            onClick={() => {
                              filterMaterial(material.category);
                              setSearchValue("");
                              setCurrentMaterialCategory(material.category);
                            }}
                          >
                            {material.category}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* user choosing where to bookmark */}
            {showBookmarkModal && (
              <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                <div className="flex items-center justify-center h-full">
                  <div
                    className={`relative mbg-input min-h-[30vh] ${
                      extraLargeDevices || largeDevices
                        ? "w-1/3"
                        : mediumDevices
                        ? "w-1/2"
                        : smallDevice
                        ? "w-2/3"
                        : "w-full mx-2"
                    } z-10 relative py-5 px-5 rounded-[5px]`}
                    style={{ overflowY: "auto" }}
                  >
                    <button
                      className="absolute right-5 top-5 font-medium text-xl"
                      disabled={btnClicked || buttonLoading}
                      onClick={() => {
                        setShowBookmarkModal(false);
                        setChooseGroupRoom(false);
                        setChooseRoom(false);
                        setShowCreateGroupInput(false);
                      }}
                    >
                      &#10006;
                    </button>

                    {chooseRoom && (
                      <div className="flex h-full py-10">
                        <div className="w-full">
                          <div>
                            <p className="text-lg mb-5">Bookmark to: </p>
                            <div className="flex flex-col gap-4">
                              <button
                                className={`${
                                  buttonLoading && buttonClickedNumber === 4
                                    ? "btn-300 py-4 rounded text-md font-medium"
                                    : "btn-300 py-4 rounded text-md font-medium"
                                } px-10 py-2 rounded`}
                                disabled={
                                  !btnClicked &&
                                  buttonLoading &&
                                  buttonClickedNumber === 4
                                }
                                onClick={() =>
                                  bookmarkMaterial(
                                    currentSharedMaterialIndex,
                                    null,
                                    "Personal",
                                    4
                                  )
                                }
                              >
                                {buttonLoading && buttonClickedNumber === 4 ? (
                                  <div>
                                    Bookmarking to Personal Study Room...
                                  </div>
                                ) : btnClicked ? (
                                  <div>Please Wait...</div>
                                ) : (
                                  <div>Personal Study Room</div>
                                )}
                              </button>

                              <button
                                disabled={
                                  btnClicked ||
                                  (buttonLoading && buttonClickedNumber === 4)
                                }
                                className="btn-300 py-4 rounded text-md font-medium"
                                onClick={() => {
                                  setChooseRoom(false);
                                  setChooseGroupRoom(true);
                                }}
                              >
                                Group Study Room
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {chooseGroupRoom && (
                      <div>
                        <button
                          className="mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800"
                          disabled={btnClicked || buttonLoading}
                          onClick={() => {
                            setChooseGroupRoom(false);
                            setChooseRoom(true);
                          }}
                        >
                          Back
                        </button>

                        <div className="mt-5 flex items-center justify-center">
                          {/* back here */}

                          {showCreateGroupInput === false ? (
                            <button
                              className={`px-4 py-2 rounded btn-800 mcolor-100 ${
                                UserId === undefined && "mt-5"
                              }`}
                              disabled={btnClicked || buttonLoading}
                              onClick={() => {
                                setShowCreateGroupInput(true);
                              }}
                            >
                              Create a group
                            </button>
                          ) : (
                            <div className="w-full">
                              <div className="my-3 border-thin-800 rounded">
                                <input
                                  type="text"
                                  placeholder="Group name..."
                                  className="w-full py-2 rounded text-center"
                                  value={
                                    groupNameValue !== "" ? groupNameValue : ""
                                  }
                                  onChange={(event) => {
                                    setGroupNameValue(event.target.value);
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  className="px-4 w-full py-2 rounded btn-700 mcolor-100"
                                  onClick={createGroupBtn}
                                >
                                  Create
                                </button>
                                <button
                                  className="px-4 w-full py-2 rounded mbg-input mcolor-900 border-thin-800"
                                  onClick={() => setShowCreateGroupInput(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {showCreateGroupInput === false &&
                          groupList
                            .slice()
                            .sort((a, b) => b.id - a.id)
                            .map(({ id, groupName }) => (
                              <div
                                key={id}
                                className={`shadows mcolor-900 rounded-[5px] p-5 my-6 mbg-input flex ${
                                  extraSmallDevice ? "flex-col" : "flex-row"
                                } items-center justify-between relative`}
                              >
                                <p className="px-1">{groupName}</p>

                                <button
                                  className={`${
                                    buttonLoading &&
                                    buttonClickedNumber === id + "1"
                                      ? "mbg-200 mcolor-900 border-thin-800"
                                      : "btn-700 mcolor-100"
                                  } px-5 py-2 rounded ${
                                    extraSmallDevice && "mt-3 text-sm"
                                  }`}
                                  disabled={
                                    !btnClicked &&
                                    buttonLoading &&
                                    buttonClickedNumber === id + "1"
                                  }
                                  onClick={() =>
                                    bookmarkMaterial(
                                      currentSharedMaterialIndex,
                                      id,
                                      "Group",
                                      id + "1"
                                    )
                                  }
                                >
                                  {buttonLoading &&
                                  buttonClickedNumber === id + "1" ? (
                                    <div>Bookmarking...</div>
                                  ) : btnClicked ? (
                                    <div>Please Wait...</div>
                                  ) : (
                                    <div>Bookmark</div>
                                  )}
                                </button>

                                {/* {expandedGroupId === id && (

                              <div className='absolute right-0 bottom-0 px-7 mb-[-114px] btn-700 mcolor-100 rounded pt-3 pb-4 opacity-80'>
                                <Link to={`/main/group/study-area/${id}`}>
                                  <p className='pt-1'>Study Area</p>
                                </Link>
                                <Link to={`/main/group/tasks/${id}`}>
                                  <p className='pt-1'>Tasks</p>
                                </Link>
                                <Link to={`/main/group/dashboard/${id}`}>
                                  <p className='pt-1'>Dashboard</p>
                                </Link>
                              </div>
                            )}  */}
                              </div>
                            ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* user sharing */}
            {showModal && (
              <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
                <div className="flex items-center justify-center h-full">
                  <div
                    className={`relative mbg-input h-[75vh] ${
                      extraLargeDevices || largeDevices
                        ? "w-1/2 px-10"
                        : mediumDevices || smallDevice
                        ? "w-2/3 px-10"
                        : "w-full mx-2 px-5"
                    } z-10 relative py-5 rounded-[5px]`}
                    style={{ overflowY: "auto" }}
                  >
                    <button
                      className="absolute right-5 top-5 font-medium text-xl"
                      disabled={btnClicked}
                      onClick={() => {
                        setShowMaterialDetails(false);
                        setShowPresentStudyMaterials(false);
                        setShowModal(false);
                      }}
                    >
                      &#10006;
                    </button>

                    {showPresentStudyMaterials && (
                      <div>
                        <p
                          class={`${
                            extraSmallDevice ? "text-md" : "text-sm"
                          } text-color-900 mb-5 mt-10 mcolor-700 text-center`}
                        >
                          Materials that are present in your personal room and
                          those you contributed within collaborative workspaces:
                        </p>

                        <br />
                        <div className="flex items-center justify-center mb-2">
                          <Link to={"/main/library/generate-quiz"}>
                            <button
                              disabled={btnClicked}
                              className={`btn-800 px-5 py-2 rounded border-thin-800 ${
                                extraSmallDevice ? "text-sm" : "text-md"
                              }`}
                            >
                              Generate a new Study Material
                            </button>
                          </Link>
                        </div>
                        <br />

                        {personalStudyMaterials.length > 0 && <p>Personal: </p>}

                        {personalStudyMaterials.map((material, index) => {
                          const category =
                            personalStudyMaterialsCategory[index]?.category ||
                            "Category not available";

                          return (
                            <div
                              key={index}
                              className={`flex ${
                                extraSmallDevice || smallDevice
                                  ? "flex-col"
                                  : "flex-row"
                              } justify-between my-3 mbg-200 border-thin-800 p-4 rounded `}
                            >
                              <div>
                                <p
                                  className={`font-medium ${
                                    extraSmallDevice ? "text-md" : "text-lg"
                                  }`}
                                >
                                  Title: {material?.title}
                                </p>
                                <p
                                  className={`mt-1 ${
                                    extraSmallDevice ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  Category: {category}
                                </p>
                              </div>

                              <div
                                className={`flex ${
                                  (smallDevice || extraSmallDevice) && "mt-3"
                                } ${
                                  extraSmallDevice ? "flex-col" : "flex-row"
                                } items-center gap-3`}
                              >
                                <button
                                  className="mbg-input w-full my-1 mcolor-900 border-thin-800 px-5 py-2 rounded"
                                  disabled={buttonLoader || btnClicked}
                                  onClick={() =>
                                    viewStudyMaterialDetails(
                                      index,
                                      "personal",
                                      "not filtered",
                                      category
                                    )
                                  }
                                >
                                  {buttonLoader &&
                                  index === buttonLoaderIndex ? (
                                    <div className="w-full flex items-center justify-center">
                                      <div className="btn-spinner"></div>
                                    </div>
                                  ) : (
                                    <div
                                      className={`${
                                        extraSmallDevice ? "text-sm" : "text-md"
                                      }`}
                                    >
                                      View
                                    </div>
                                  )}
                                </button>

                                <button
                                  className={`btn-700 mcolor-100 px-5 py-2 rounded w-full ${
                                    extraSmallDevice ? "text-sm" : "text-md"
                                  }`}
                                  onClick={() =>
                                    shareMaterial(
                                      index,
                                      "personal",
                                      material?.title
                                    )
                                  }
                                >
                                  {btnClicked &&
                                  material?.title === currentMaterial
                                    ? "Sharing..."
                                    : "Share"}
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        <br />

                        {groupStudyMaterials.length > 0 && <p>Group: </p>}

                        {groupStudyMaterials.map((material, index) => {
                          const category =
                            groupStudyMaterialsCategory[index]?.category ||
                            "Category not available";

                          return (
                            <div
                              key={index}
                              className={`flex ${
                                extraSmallDevice || smallDevice
                                  ? "flex-col"
                                  : "flex-row"
                              } justify-between my-3 mbg-200 border-thin-800 p-4 rounded `}
                            >
                              <div>
                                <p
                                  className={`font-medium ${
                                    extraSmallDevice ? "text-md" : "text-lg"
                                  }`}
                                >
                                  Title: {material?.title}
                                </p>
                                <p
                                  className={`mt-1 ${
                                    extraSmallDevice ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  Category: {category}
                                </p>
                              </div>

                              <div
                                className={`flex ${
                                  (smallDevice || extraSmallDevice) && "mt-3"
                                } ${
                                  extraSmallDevice ? "flex-col" : "flex-row"
                                } items-center gap-3`}
                              >
                                <button
                                  className="mbg-input w-full my-1 mcolor-900 border-thin-800 px-5 py-2 rounded"
                                  disabled={buttonLoader || btnClicked}
                                  onClick={() =>
                                    viewStudyMaterialDetails(
                                      index,
                                      "group",
                                      "not filtered",
                                      category
                                    )
                                  }
                                >
                                  {buttonLoader &&
                                  index === buttonLoaderIndex ? (
                                    <div className="w-full flex items-center justify-center">
                                      <div className="btn-spinner"></div>
                                    </div>
                                  ) : (
                                    <div
                                      className={`${
                                        extraSmallDevice ? "text-sm" : "text-md"
                                      }`}
                                    >
                                      View
                                    </div>
                                  )}
                                </button>

                                <button
                                  className={`btn-700 mcolor-100 px-5 py-2 rounded w-full ${
                                    extraSmallDevice ? "text-sm" : "text-md"
                                  }`}
                                  onClick={() =>
                                    shareMaterial(
                                      index,
                                      "group",
                                      material?.title
                                    )
                                  }
                                >
                                  {btnClicked &&
                                  material?.title === currentMaterial
                                    ? "Sharing..."
                                    : "Share"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {buttonLoader && (
                      <div className="w-full flex items-center justify-center">
                        <div className="btn-spinner"></div>
                      </div>
                    )}

                    {showMaterialDetails && (
                      <div>
                        {enableBackButton && (
                          <button
                            disabled={buttonLoader || btnClicked}
                            className="mbg-200 mcolor-900 rounded px-4 py-1 rounded border-thin-800"
                            onClick={() => {
                              setShowMaterialDetails(false);
                              setShowPresentStudyMaterials(true);
                            }}
                          >
                            Back
                          </button>
                        )}

                        <div className="my-6">
                          <p className="mcolor-900 text-center text-xl font-medium">
                            {currentMaterialTitle} from{" "}
                            {currentMaterialCategory}
                          </p>

                          <div className="flex items-center justify-between my-5 gap-1">
                            <button
                              className={`border-thin-800 w-full rounded py-2 ${
                                showContext ? "" : "btn-700 mcolor-100"
                              } ${extraSmallDevice ? "text-xs" : "text-md"}`}
                              onClick={() => {
                                setShowQuiz(false);
                                setShowNotes(false);
                                setShowContext(true);
                              }}
                            >
                              Context
                            </button>
                            <button
                              className={`border-thin-800 w-full rounded py-2 ${
                                showNotes ? "" : "btn-700 mcolor-100"
                              } ${extraSmallDevice ? "text-xs" : "text-md"}`}
                              onClick={() => {
                                setShowContext(false);
                                setShowQuiz(false);
                                setShowNotes(true);
                              }}
                            >
                              Notes
                            </button>
                            <button
                              className={`border-thin-800 w-full rounded py-2 ${
                                showQuiz ? "" : "btn-700 mcolor-100"
                              } ${extraSmallDevice ? "text-xs" : "text-md"}`}
                              onClick={() => {
                                setShowContext(false);
                                setShowNotes(false);
                                setShowQuiz(true);
                              }}
                            >
                              Quiz
                            </button>
                          </div>

                          {showContext && (
                            <p
                              className={`text-justify my-5 ${
                                extraSmallDevice
                                  ? "text-xs"
                                  : smallDevice
                                  ? "text-sm"
                                  : "text-md"
                              }`}
                            >
                              {context}
                            </p>
                          )}

                          {showNotes && (
                            <div className="my-10">
                              {materialNotes.map((material) => (
                                <div
                                  className={`my-5 ${
                                    extraSmallDevice
                                      ? "text-xs"
                                      : smallDevice
                                      ? "text-sm font-medium"
                                      : "text-md font-medium"
                                  }`}
                                >
                                  <p className="color-primary">
                                    Question:{" "}
                                    <span className="mcolor-900 mb-4">
                                      {material.question}
                                    </span>
                                  </p>

                                  <p className="color-primary mt-1">
                                    Answer:{" "}
                                    <span className="mcolor-900">
                                      {material.answer}
                                    </span>
                                  </p>

                                  <div className="border-hr my-5"></div>
                                </div>
                              ))}
                              <div className="mb-[-1.5rem]"></div>
                            </div>
                          )}

                          {showQuiz && (
                            <div className="mt-5">
                              <br />
                              {materialMCQ.map((material, quesIndex) => (
                                <div
                                  className={`${
                                    extraSmallDevice
                                      ? "text-xs"
                                      : smallDevice
                                      ? "text-sm font-medium"
                                      : "text-md font-medium"
                                  } ${
                                    material.quizType === "MCQA" ||
                                    material.quizType === "Identification"
                                      ? "mb-14"
                                      : material.quizType !== "ToF"
                                      ? ""
                                      : ""
                                  }`}
                                  key={material.id}
                                >
                                  <p className="mt-2 color-primary">
                                    Question:{" "}
                                    <span className="mcolor-800 font-medium ml-1">
                                      {material.question}
                                    </span>
                                  </p>
                                  <p className="color-primary">
                                    Answer:{" "}
                                    <span className="mcolor-800 font-medium ml-1">
                                      {material.answer}
                                    </span>
                                  </p>

                                  {material.quizType === "MCQA" && (
                                    <p className="mt-5 mb-1">Choices: </p>
                                  )}

                                  <ul
                                    className={`grid grid-cols-${
                                      mediumDevices
                                        ? "2"
                                        : smallDevice || extraSmallDevice
                                        ? "1"
                                        : "3"
                                    } gap-3`}
                                  >
                                    {materialMCQChoices
                                      .filter(
                                        (choice) =>
                                          choice.QuesAnId === material.id &&
                                          material.quizType === "MCQA"
                                      )
                                      .map((choice, index) => (
                                        <li
                                          key={index}
                                          className="btn-300 text-center py-1 rounded"
                                        >
                                          {choice.choice}
                                        </li>
                                      ))}
                                  </ul>

                                  <div className="border-hr mt-10"></div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
