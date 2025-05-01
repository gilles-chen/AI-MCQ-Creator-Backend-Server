import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

function MCQResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState(location.state?.mcqs || []);
  const description = location.state?.description || "";
  const hasDescription = location.state?.hasDescription || false;
  const [solvabilityChecked, setSolvabilityChecked] = useState(false);
  const fieldOfStudy = location.state?.fieldOfStudy || "";
  const subject = location.state?.subject || "";
  const cognitiveLevel = location.state?.cognitiveLevel || "";
  const [isLoading, setIsLoading] = useState(false);
  const [solvableMCQsCount, setSolvableMCQsCount] = useState(0);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleCheckSolvability = async () => {
    if (solvabilityChecked) return;

    setIsLoading(true);

    const mcqsData = {
      mcqs: mcqs.map((mcq) => ({
        id: mcq.id,
        question: mcq.question,
        options: mcq.options,
        correct_answer: mcq.correct_answer,
        feedback: mcq.feedback,
      })),
      description: description,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/verify_mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mcqsData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const solvabilityData = await response.json();

      const updatedMcqs = mcqs.map((mcq, index) => {
        const solvabilityInfo = JSON.parse(solvabilityData[index]);
        const mcqId = Object.keys(solvabilityInfo)[0];
        const [solvableStatus, reason] = Object.entries(
          solvabilityInfo[mcqId]
        )[0];
        return {
          ...mcq,
          solvable: solvableStatus === "TRUE",
          solvabilityReason: reason,
        };
      });

      const solvableCount = updatedMcqs.filter((mcq) => mcq.solvable).length;
      setSolvableMCQsCount(solvableCount);
      setMcqs(updatedMcqs);
      setSolvabilityChecked(true);
    } catch (error) {
      console.error("Error checking solvability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadMCQs = () => {
    let mcqsToDownload;

    if (hasDescription && solvabilityChecked) {
      // If there's a description and solvability has been checked, download only solvable MCQs
      mcqsToDownload = mcqs.filter((mcq) => mcq.solvable);
    } else if (!hasDescription) {
      // If there's no description, you can download all mcqs
      mcqsToDownload = mcqs;
    } else {
      // This case shouldn't be reached due to button being disabled
      return;
    }

    const dataToDownload = { mcqs: mcqsToDownload };
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${fieldOfStudy}_${subject}_${cognitiveLevel}_mcqs.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">MCQ Results</h1>

          <div className="flex justify-between mb-6">
            <button
              onClick={handleNavigateBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Form
            </button>
            <div className="tooltip relative">
              <button
                onClick={handleCheckSolvability}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  hasDescription && !solvabilityChecked && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!hasDescription || solvabilityChecked || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  "Check Solvability"
                )}
              </button>
              {!hasDescription && (
                <span className="tooltiptext">
                  Since no Description was provided, you cannot check
                  solvability of the MCQs based on a given Description.
                </span>
              )}
              {hasDescription && solvabilityChecked && (
                <span className="tooltiptext">
                  You already checked the solvability.
                </span>
              )}
            </div>
            <button
              onClick={handleDownloadMCQs}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !hasDescription || (hasDescription && solvabilityChecked)
                  ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={hasDescription && !solvabilityChecked}
            >
              {hasDescription
                ? solvabilityChecked
                  ? "Download Solvable MCQs"
                  : "Check Solvability First"
                : "Download All MCQs"}
            </button>
          </div>

          {solvabilityChecked && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <p className="font-bold">Solvability Check Results</p>
              <p>{solvableMCQsCount} out of {mcqs.length} MCQs are solvable based on the provided description.</p>
            </div>
          )}

          {mcqs.map((mcq) => (
            <div
              key={mcq.id}
              className="bg-white shadow-md rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {mcq.question}
              </h2>
              <div className="space-y-3">
                {Object.entries(mcq.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-md ${
                      key === mcq.correct_answer
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-700">
                  Correct Answer: {mcq.correct_answer}
                </p>
                <p className="mt-2 text-green-600">{mcq.feedback.correct}</p>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-700">
                  Feedback for incorrect answers:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {Object.entries(mcq.feedback.incorrect).map(
                    ([key, value]) => (
                      <li key={key} className="text-red-600">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p
                  className={`font-medium ${
                    mcq.solvable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Solvability:{" "}
                  {mcq.solvable !== undefined
                    ? mcq.solvable
                      ? "Solvable"
                      : "Not Solvable"
                    : "Not checked"}
                </p>
                {mcq.solvabilityReason && (
                  <p className="mt-2 text-gray-600">
                    Reason: {mcq.solvabilityReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MCQResultsPage;
