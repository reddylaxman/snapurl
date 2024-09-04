import React, { useRef, useState } from "react";
import { FaCopy, FaQrcode, FaExternalLinkAlt } from "react-icons/fa";
import { Toast } from "primereact/toast";

const SnapURL = () => {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShortened, setIsShortened] = useState(false);
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = alias
      ? "https://snap-url-shortener.vercel.app/custom"
      : "https://snap-url-shortener.vercel.app/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl, alias }),
      });

      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.id);
        setIsShortened(true);
      } else {
        console.error("Error shortening the URL:", data.error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "An error occurred while shortening the URL",
          life: 5000,
        });
        setShortUrl("");
      }
    } catch (error) {
      console.error("Error shortening the URL:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while shortening the URL",
        life: 5000,
      });
      setShortUrl("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setLongUrl("");
    setAlias("");
    setShortUrl("");
    setIsShortened(false);
  };

  const handleCopy = () => {
    const urlToCopy = `https://snap-url-shortener.vercel.app/${shortUrl}`;

    if (navigator.clipboard) {
      // Modern Clipboard API
      navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
          toast.current.show({
            severity: "success",
            summary: "Copied",
            detail: "URL copied to clipboard",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
          toast.current.show({
            severity: "error",
            summary: "Copy Failed",
            detail: "Failed to copy URL to clipboard",
            life: 3000,
          });
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = urlToCopy;
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          toast.current.show({
            severity: "success",
            summary: "Copied",
            detail: "URL copied to clipboard",
            life: 3000,
          });
        } else {
          throw new Error("Failed to copy");
        }
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.current.show({
          severity: "error",
          summary: "Copy Failed",
          detail: "Failed to copy URL to clipboard",
          life: 3000,
        });
      }

      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toast ref={toast} />
      <div className="w-4/3 max-w-xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          SnapURL
        </h1>
        {!isShortened ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:space-x-4 ml-4">
              <div className="flex-4">
                <label
                  htmlFor="longUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Long URL
                </label>
                <input
                  type="text"
                  id="longUrl"
                  className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="Enter long link here"
                  required
                />
              </div>

              <div className="flex-2 mt-4 sm:mt-0">
                <label
                  htmlFor="alias"
                  className="block text-sm font-medium text-gray-700"
                >
                  Optional
                </label>
                <input
                  type="text"
                  id="alias"
                  className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Enter custom alias"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={!longUrl || isSubmitting}
            >
              {isSubmitting ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Long URL
              </label>
              <input
                type="text"
                readOnly
                className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
                value={longUrl}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SnapURL
              </label>
              <input
                type="text"
                readOnly
                className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
                value={`https://snap-url-shortener.vercel.app/${shortUrl}`}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={() =>
                  window.open(
                    `https://snap-url-shortener.vercel.app/${shortUrl}`,
                    "_blank"
                  )
                }
                className="flex items-center justify-center w-3/4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                <FaExternalLinkAlt />
                <span className="ml-2">Visit URL</span>
              </button>
              <button className="flex items-center justify-center w-1/4 px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600">
                <FaQrcode />
                <span className="ml-2">QR</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-1/4 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                <FaCopy />
                <span className="ml-2">Copy</span>
              </button>
            </div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 mt-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Shorten Another URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnapURL;
