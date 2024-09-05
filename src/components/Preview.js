import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const UrlPreview = () => {
  const { id } = useParams();
  const [urlDetails, setUrlDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SHORTEN_URL}preview/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch URL details.");
        }

        const data = await response.json();
        setUrlDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrlDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-lg">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-950 via-blue-500 to-red-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">SnapURL</h1>
        <Link
          to="/"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          Visit Home page
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center flex-grow p-4">
        <div className="border p-8 rounded-lg shadow-lg bg-white max-w-full sm:max-w-2xl w-full">
          {urlDetails ? (
            <>
              <div className="mb-4">
                <p className="text-gray-700 text-xl mb-2">
                  <strong>Original URL:</strong>
                </p>
                <p className="text-blue-500 hover:underline text-lg">
                  {urlDetails.redirectURL}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-xl mb-2">
                  <strong>Shortened URL:</strong>
                </p>
                <a
                  href={`${process.env.REACT_APP_SHORTEN_URL}${id}`}
                  className="text-blue-500 hover:underline text-lg"
                >
                  {`${process.env.REACT_APP_SHORTEN_URL}${id}`}
                </a>
              </div>
            </>
          ) : (
            <p>No details available for this URL.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlPreview;
