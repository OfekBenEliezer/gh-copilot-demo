# 🚀 GitHub Copilot Agent Demo - Supply Chain App

This repository demonstrates how to use GitHub Copilot Agent Mode to understand, modify, and improve a real full-stack application.

The project is based on a supply chain management system and is used to showcase modern AI-assisted development workflows.

---

## 🧠 What This Demo Shows

This demo focuses on turning GitHub Copilot from a coding assistant into an autonomous development agent.

Key capabilities demonstrated:

- Understanding an existing codebase  
- Planning feature implementation (Plan Mode)  
- Making multi-file changes (Frontend + Backend)  
- Running the application and fixing errors automatically  
- Generating and improving tests  
- Performing code reviews and explaining changes  
- Applying secure development practices  
- Demonstrating agent governance and control  

---

## 🏗️ Architecture Overview

This is a full-stack TypeScript application:

### Frontend
- React + TypeScript  
- Vite  
- Tailwind CSS  
- Located in /frontend  

### Backend
- Express.js + TypeScript  
- REST API  
- Swagger documentation  
- Located in /api  

### Communication
- REST API over HTTP  
- Frontend communicates with backend via http://localhost:3000  

---

## ⚙️ Running the Project

### Prerequisites
- Node.js (v18+ recommended)

### Install dependencies
npm install

### Build the project
npm run build

### Run the project
npm run dev

### Access the app
- Frontend: http://localhost:5137  
- API: http://localhost:3000  

---

## 🤖 Example Copilot Prompts

Use these prompts inside GitHub Copilot Chat (Agent Mode):

Understand the system:
Explain this project architecture and how frontend and backend communicate.

Plan a feature:
Create a plan to add category filtering to products end to end.

Implement and verify:
Implement the feature, run the app, and fix any issues.

Review changes:
Summarize the changes and identify risks or improvements.

---

## 🔐 Governance & Best Practices

This demo emphasizes that AI does not replace developers - it augments them.

- All changes should be reviewed before merging  
- Agent permissions should be scoped (least privilege)  
- Sensitive data must not be exposed  
- CI/CD validation should remain in place  

---

## ⚡ Key Takeaway

GitHub Copilot is no longer just a code completion tool.

It acts as an intelligent agent that can:

- Understand intent  
- Plan execution  
- Modify systems  
- Validate outcomes  

All while keeping humans in control of critical decisions.

---

## 📌 Author

Ofek Ben Eliezer  
Cloud & AI Architect  
Microsoft MVP
