import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  let [notes, setNotes] = useState([]);
  let [newNote, setNewNote] = useState("");
  let { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  let getNotes = async () => {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/notes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      let data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  let addNote = async () => {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/notes/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({ body: newNote })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      let data = await response.json();
      setNotes([...notes, data]);
      setNewNote("");
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  let updateNote = async (id, newBody) => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/notes/update/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({ body: newBody })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      let data = await response.json();
      setNotes(notes.map(note => note.id === id ? data : note));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  let deleteNote = async (id) => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/notes/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-gray-900 font-semibold text-lg">
          Welcome, User
        </div>
        <div>
          <button
            onClick={() => navigate('/')}
            className="mx-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            Home
          </button>
          <button
            onClick={logoutUser}
            className="mx-2 text-red-500 hover:text-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900">Notes</h1>
              <p className="mt-2 text-gray-500">Manage your notes here</p>
            </div>
            <div className="mt-5">
              <div className="relative mt-6">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note"
                  className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                />
                <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">
                  New Note
                </label>
              </div>
              <button
                onClick={addNote}
                className="mt-4 w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
              >
                Add Note
              </button>
              <ul className="mt-5">
                {notes.length > 0 ? (
                  notes.map(note => (
                    <li key={note.id} className="relative mt-4">
                      <input
                        type="text"
                        value={note.body}
                        onChange={(e) => updateNote(note.id, e.target.value)}
                        className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                      />
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="absolute right-0 top-0 mt-1 px-3 py-1 bg-red-500 text-white rounded-md focus:outline-none"
                      >
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">No notes available.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
