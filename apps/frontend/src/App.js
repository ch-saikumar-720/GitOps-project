import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const API = process.env.REACT_APP_API || "/api";

  useEffect(() => {
    axios.get(`${API}/api/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  const addUser = () => {
    axios.post(`${API}/api/users`, { name }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User App</h1>

      <input
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addUser}>Add</button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
