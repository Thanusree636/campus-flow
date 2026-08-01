# CampusFlow 🚀

> **AI-Powered College Email Ingestion, Task Prioritization, and Automated Schedule Management System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green.svg)](https://www.mongodb.com/)

---

## 🌟 Overview

**CampusFlow** solves the universal student headache of missed deadlines, exam room changes, fee notices, and placement updates buried inside unstructured, chaotic college emails. 

By automating email ingestion, applying multi-stage entity extraction (powered by Gemini/Bedrock with regex fallback), computing dynamic mathematical priority scores, and executing idempotent Google Calendar synchronization, CampusFlow transforms an overflowing inbox into an intelligent, prioritized student dashboard.

---

## ⚙️ Core Architecture & 6-Stage Pipeline

1. **Ingestion**: Gmail Webhooks (Google Cloud Pub/Sub push) filtering allowed senders & parsing attachments (`.pdf`, `.docx`).
2. **Extraction**: Structural extraction converting messy email bodies into strictly typed JSON entities (Dates, Times, Venues, Fees, Deadlines, Action Items).
3. **Categorization**: Classifies parsed entities into `EXAMS`, `DEADLINES`, `PLACEMENTS`, `FEES`, `TRANSPORT`, or `EVENTS`.
4. **Prioritization Matrix**: Calculates a dynamic priority score for every item based on:
   $$\text{Priority Score} = (\text{Base Category Weight} \times \text{Urgency Multiplier}) + \text{Risk Factors}$$
5. **Idempotent Sync**: Converts prioritized items into Google Calendar API v3 events with zero duplicate generation using persistent mapping IDs.
6. **Grounded AI Interaction**: RAG assistant built strictly on top of the student's personal structured task graph.

---

## 🛠️ Tech Stack Specification

* **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React, react-markdown.
* **Backend**: Node.js 18+ (ESM), Express 4, JWT, Multer.
* **Database**: MongoDB via Mongoose 8.
* **AI & Third-Party Integrations**: Google Gemini (Categorization/Extraction), Google Calendar API v3, Gmail API, Google Cloud Pub/Sub.
* **Offline-First Resilience**: Automatic fallback engines for missing LLM or Calendar API credentials.

---

#ent
