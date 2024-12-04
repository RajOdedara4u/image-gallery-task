import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios"; // here we use axios for any async tasks
import "animate.css"; // 4 animation
function App() {
  const [images, setImages] = useState([]); // it contain all images
  const [query, setQuery] = useState("nature"); // query for search
  const [loading, setLoading] = useState(false); // show the loding spinner while loading
  const [selectedImage, setSelectedImage] = useState(null); // for manage model for single image
  const [page, setPage] = useState(1); // Current page number

  const UNSPLASH_KEY = "Sv7axRJ7FJBtQbzr6GoAzK3G3noWez36WOMnSh2dXuk"; // this is my account secret key and also have limits and we can store it into env variable

  // function for tech images from api
  const fetchImages = async (currentPage = 1) => {
    setLoading(true); // show the spinner
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`, // sent get request with paramiters
        {
          params: { query, per_page: 10, page: currentPage }, //ecach page contain 10 photos
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`,
          },
        }
      );

      // here i use es6 future for append old array with new data which is just arrived when user tap show more button
      setImages((prevImages) => [...prevImages, ...response.data.results]);
      console.log(images);
    } catch (error) {
      console.error("Error fetching data:", error); // log error if problem arrives
    } finally {
      setLoading(false); // at and stop spinner
    }
  };

  useEffect(() => {
    fetchImages(page); // Fetch images on page change or query change manage by hook for access componentUpdate lifecycle method
  }, [query, page]);

  const loadMoreImages = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page to fetch the next set of images Each page conatin 10 image
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          React Photo Gallery
        </h1>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="search images..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value); // set currunt input tag value into query state
              setImages([]); // Clear current images array on new search
              setPage(1); // Reset the page
            }}
            className="w-[75%] md:w-[50%] p-2 border border-gray-300 rounded-md"
          />
        </div>
      </header>

      {/* image grid for show all images, show atlest 2 images in row in small device*/}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className=" cursor-pointer animate__animated animate__bounceIn "
            onClick={() => setSelectedImage(image)} // storing single image data into state of selectedimage for model
          >
            <img
              src={image.urls.small}
              className="shadow-md w-full h-48 object-cover rounded-lg "
            />
          </div>
        ))}
      </div>
      {/* Loading spinner for fallback */}
      {loading && (
        <div
          role="status"
          className="mx-auto w-20 flex justify-center items-center flex-col"
        >
          <svg
            aria-hidden="true"
            className="inline w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="text-center">Loading...</span>
        </div>
      )}
      {/* load More images button */}
      {!loading && images.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={loadMoreImages}
          >
            Load More
          </button>
        </div>
      )}
      {/* mode for show single image when it was clicked*/}
      {selectedImage && ( // it show when selectedImage state contain value
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // when outeside of image clicked it set selectedImage state null so it will going to invisible
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // when outside of model clicked it will going to close model
          >
            <img
              src={selectedImage.urls.regular}
              className="w-full max-h-[70vh] rounded-lg mb-4 "
            />
            <div className="w-[100%] flex justify-between items-center ">
              {" "}
              <p className="text-sm text-gray-500">
                Photo by {selectedImage.user.name || "Not Published"}
              </p>
              <div className="flex text-[0.9rem] justify-center items-center gap-1">
                <svg
                  fill="red"
                  className="w-[15px] md:w-[20px]"
                  viewBox="0 0 471.701 471.701"
                >
                  <g>
                    <path
                      d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
               c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
               l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
               C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
               s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
               c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
               C444.801,187.101,434.001,213.101,414.401,232.701z"
                    />
                  </g>
                </svg>
                {selectedImage.likes || "0"}
              </div>
            </div>
            <p className="text-gray-700 mt-2">
              {selectedImage.description || "No description available."}
            </p>
            <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
