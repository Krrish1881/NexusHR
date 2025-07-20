# NexusHR – Quantum Talent Management


**NexusHR** is a futuristic, AI-powered talent management system with a highly interactive and visually immersive interface. It allows you to browse, filter, and analyze a talent database in real time. The backend is built with **Node.js + Express**, and the frontend is crafted with modern HTML, CSS (neon-cyber aesthetic), and JavaScript.

---

## 🚀 Features

- **Immersive UI**  
  A futuristic quantum-themed interface with animated backgrounds, glitch effects, and holographic UI elements.

- **Dynamic Talent Search**  
  Search by name, title, department, skill, or location.

- **Multi-level Filters**  
  Filter candidates by **Department**, **Skill Matrix**, and **Experience Level**.

- **Real-time Analytics**  
  Displays **total candidates**, **average experience**, and AI-generated insights about the talent pool.

- **RESTful Backend**  
  Built with **Express.js**, serving candidate data from a `db.json` file.

- **API Endpoints**  
  - `GET /api/candidates` – fetch all candidates  
  - `POST /api/candidates` – add new candidate

---

## 🛠️ Tech Stack

### **Frontend**
- HTML5 + CSS3 (Neon & holographic design)
- Vanilla JavaScript (Dynamic rendering, filtering, analytics)
- Google Fonts (**Orbitron**, **Roboto**)
- Font Awesome Icons

### **Backend**
- Node.js + Express.js
- CORS for API access
- Local JSON database (`db.json`)

---

## 📂 Project Structure

```
nexushr/
├── index.html          # Frontend UI
├── style.css           # Cyberpunk-styled CSS
├── script.js           # Frontend logic (fetch, filter, analytics)
├── backend/
    ├── db.json             # JSON database for candidate data
    ├── server.js           # Express backend server
    ├── package.json        # Project dependencies & scripts
    └── package-lock.json   # Dependency lockfile
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/nexushr.git
cd nexushr
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the backend server
```bash
npm start
```
This will start the backend on **http://localhost:3000**

### 4️⃣ Open the frontend
Simply open `index.html` in your browser.  
> ✅ Make sure the backend server is running, as the frontend fetches candidate data from it.

---

## 🔗 API Endpoints

| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| GET    | `/api/candidates`  | Fetch all candidates |
| POST   | `/api/candidates`  | Add a new candidate (requires JSON body) |

Example `POST` request body:
```json
{
  "name": "John Doe",
  "title": "AI Engineer",
  "department": "Engineering",
  "description": "Specializes in ML and AI systems.",
  "skills": ["Python", "TensorFlow", "ML Ops"],
  "experience": "5",
  "location": "Remote"
}
```

---

<img width="1895" height="907" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/41dc815d-e1ca-4657-b101-24a098fde7c6" />

---

## 📜 License

MIT License © 2025 [Krish Dobariya]
