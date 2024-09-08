import React, { useRef, useState } from "react";
import { FaCopy, FaQrcode, FaExternalLinkAlt } from "react-icons/fa";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../images/logo.png";
import PasswordChecklist from "react-password-checklist";

const SnapURL = () => {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShortened, setIsShortened] = useState(false);
  const [isAliasFocused, setIsAliasFocused] = useState(false);
  const [displayQRCodeDialog, setDisplayQRCodeDialog] = useState(false);
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = alias
      ? process.env.REACT_APP_CUSTOM_SHORTEN_URL
      : process.env.REACT_APP_SHORTEN_URL;

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
    setIsAliasFocused(false);
  };

  const handleCopy = () => {
    const urlToCopy = `${process.env.REACT_APP_SHORTEN_URL}${shortUrl}`;

    if (navigator.clipboard) {
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

  const handleQRCodeDownload = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Toast ref={toast} />
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SnapURL" className="w-64 h-32" />
        </div>

        {!isShortened ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1">
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

              <div className="flex-1 mt-4 sm:mt-0">
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
                  onFocus={() => setIsAliasFocused(true)}
                  onBlur={() => setIsAliasFocused(false)}
                  placeholder="Enter custom alias"
                />
              </div>
            </div>
            {(isAliasFocused || alias) && (
              <div className="mt-2">
                <PasswordChecklist
                  rules={["minLength", "number", "capital"]}
                  minLength={8}
                  value={alias}
                  onChange={() => {}}
                  className="text-sm text-gray-700"
                />
              </div>
            )}

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
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <button
                onClick={() =>
                  window.open(
                    `https://snap-url-shortener.vercel.app/${shortUrl}`,
                    "_blank"
                  )
                }
                className="flex items-center justify-center w-full sm:w-1/3 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                <FaExternalLinkAlt />
                <span className="ml-2">Visit URL</span>
              </button>
              <button
                onClick={() => setDisplayQRCodeDialog(true)}
                className="flex items-center justify-center w-full sm:w-1/3 mt-2 sm:mt-0 px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600"
              >
                <FaQrcode />
                <span className="ml-2">QR Code</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-full sm:w-1/3 mt-2 sm:mt-0 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                <FaCopy />
                <span className="ml-2">Copy URL</span>
              </button>
            </div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 mt-4 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            >
              Shorten Another URL
            </button>
          </div>
        )}

        <Dialog
          header="QR Code"
          visible={displayQRCodeDialog}
          onHide={() => setDisplayQRCodeDialog(false)}
          footer={
            <Button
              label="Download"
              icon="pi pi-download"
              onClick={handleQRCodeDownload}
            />
          }
          style={{ width: "30vw" }}
          breakpoints={{ "960px": "75vw", "640px": "60vw" }}
        >
          <div className="flex items-center justify-center">
            <QRCodeCanvas
              value={`https://snap-url-shortener.vercel.app/${shortUrl}`}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SnapURL;
