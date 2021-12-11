import { createContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Fetch Feedback
  const fetchFeedback = async () => {
    const response = await fetch(
      'https://my-json-server.typicode.com/hawkeye7662/demo/feedback?_sort=id&_order=desc'
    );
    const data = await response.json();

    setFeedback(data);
    setIsLoading(false);
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(
        `https://my-json-server.typicode.com/hawkeye7662/demo/feedback/${id}`,
        {
          method: 'DELETE',
        }
      );

      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  // Add Feedback
  const addFeedback = async (newFeedback) => {
    const response = await fetch(
      'https://my-json-server.typicode.com/hawkeye7662/demo/feedback',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      }
    );
    const data = await response.json();
    setFeedback([data, ...feedback]);
  };

  // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
  };

  // Update Feedback Item
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(
      `https://my-json-server.typicode.com/hawkeye7662/demo/feedback/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      }
    );

    const data = await response.json();

    setFeedback(
      feedback.map((item) => {
        return item.id === id ? { ...item, ...data } : item;
      })
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
