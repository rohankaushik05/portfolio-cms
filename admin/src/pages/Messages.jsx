// import { useEffect, useState, useCallback } from "react";

// const API_URL = "http://localhost:5000/api";

// function Messages() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [message, setMessage] = useState("");

// const fetchMessages = useCallback(async () => {
//   try {
//     const token = localStorage.getItem("accessToken");
//     const response = await fetch(`${API_URL}/contact`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to fetch messages");
//     }

//     setMessages(Array.isArray(data) ? data : data.messages || data.data || []);
//   } catch (error) {
//     setMessage(error instanceof Error ? error.message : "Failed to fetch messages");
//   } finally {
//     setLoading(false);
//   }
// }, []);

// useEffect(() => {
//   Promise.resolve().then(fetchMessages);
// }, [fetchMessages]);

//   const handleView = async (id) => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       const response = await fetch(`${API_URL}/contact/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch message");
//       }

//       setSelectedMessage(data);

//       // Mark as read if currently unread
//       if (!data.read) {
//         await fetch(`${API_URL}/contact/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             read: true,
//           }),
//         });

//         fetchMessages();
//       }
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("accessToken");

//     try {
//       const response = await fetch(`${API_URL}/contact/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Delete failed");
//       }

//       setMessage("Message deleted successfully");

//       if (selectedMessage?._id === id) {
//         setSelectedMessage(null);
//       }

//       fetchMessages();
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800">
//         Messages
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Manage messages received from your portfolio contact form.
//       </p>

//       {message && (
//         <p className="mt-4 text-blue-600">
//           {message}
//         </p>
//       )}

//       {loading ? (
//         <p className="mt-6">Loading messages...</p>
//       ) : messages.length === 0 ? (
//         <p className="mt-6 text-gray-500">
//           No messages found.
//         </p>
//       ) : (
//         <div className="mt-6 space-y-4">
//           {messages.map((item) => (
//             <div
//               key={item._id}
//               className={`rounded-lg bg-white p-5 shadow ${
//                 !item.read ? "border-l-4 border-blue-600" : ""
//               }`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     {item.subject}
//                   </h2>

//                   <p className="mt-1 text-sm text-gray-500">
//                     From: {item.name} ({item.email})
//                   </p>

//                   <p className="mt-2 text-gray-700">
//                     {item.message}
//                   </p>

//                   <p className="mt-2 text-xs text-gray-400">
//                     {item.read ? "Read" : "Unread"}
//                   </p>
//                 </div>

//                 <div className="flex shrink-0 gap-2">
//                   <button
//                     onClick={() => handleView(item._id)}
//                     className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
//                   >
//                     View
//                   </button>

//                   <button
//                     onClick={() => handleDelete(item._id)}
//                     className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedMessage && (
//         <div className="mt-8 rounded-lg bg-white p-6 shadow">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-semibold text-gray-800">
//               Message Details
//             </h2>

//             <button
//               onClick={() => setSelectedMessage(null)}
//               className="rounded bg-gray-500 px-3 py-2 text-white"
//             >
//               Close
//             </button>
//           </div>

//           <div className="mt-5 space-y-2">
//             <p>
//               <strong>Name:</strong> {selectedMessage.name}
//             </p>

//             <p>
//               <strong>Email:</strong> {selectedMessage.email}
//             </p>

//             <p>
//               <strong>Subject:</strong> {selectedMessage.subject}
//             </p>

//             <div className="pt-3">
//               <strong>Message:</strong>

//               <p className="mt-2 rounded bg-gray-50 p-4">
//                 {selectedMessage.message}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Messages;

import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function extractMessages(data) {
  if (Array.isArray(data)) return data;

  const candidates = [
    data?.contacts,
    data?.messages,
    data?.data,
    data?.data?.contacts,
    data?.data?.messages,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/contact`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      const list = extractMessages(data);
      setMessages(list);

      // Helpful if the API response shape differs from the formats above.
      if (!list.length) {
        console.log("GET /api/contact response:", data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  let cancelled = false;

  const loadMessages = async () => {
    // fetchMessages updates state, so don't run it after cleanup.
    if (!cancelled) {
      await fetchMessages();
    }
  };

  const timer = setTimeout(loadMessages, 0);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [fetchMessages]);

  const handleView = async (id) => {
    setError("");
    setStatus("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/contact/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      // Supports APIs that return either the message directly or wrapped.
      const item = data.contact ?? data.data ?? data;
      setSelectedMessage(item);

      if (!item.read) {
        const updateResponse = await fetch(`${API_URL}/contact/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ read: true }),
        });

        if (!updateResponse.ok) {
          const updateData = await updateResponse.json();
          throw new Error(updateData.message || "Could not mark message as read");
        }

        await fetchMessages();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch message");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setStatus("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Delete failed (${response.status})`);
      }

      setStatus("Message deleted successfully");
      if (selectedMessage?._id === id) setSelectedMessage(null);
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <p className="mt-2 text-gray-500">
            Manage messages received from your portfolio contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="rounded bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {status && <p className="mt-4 text-green-600">{status}</p>}

      {loading ? (
        <p className="mt-6">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="mt-6 text-gray-500">No messages found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((item) => (
            <div
              key={item._id}
              className={`rounded-lg bg-white p-5 shadow ${
                !item.read ? "border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.subject || "(No subject)"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    From: {item.name || "Unknown"} ({item.email || "No email"})
                  </p>
                  <p className="mt-2 text-gray-700">{item.message}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {item.read ? "Read" : "Unread"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleView(item._id)}
                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Message Details
            </h2>
            <button
              onClick={() => setSelectedMessage(null)}
              className="rounded bg-gray-500 px-3 py-2 text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <p><strong>Name:</strong> {selectedMessage.name}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>
            <div className="pt-3">
              <strong>Message:</strong>
              <p className="mt-2 rounded bg-gray-50 p-4">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;