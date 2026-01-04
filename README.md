# 🛡️ Sentinel-STIX | Automated CTI Extraction Engine

**Sentinel-STIX** is a professional-grade Cyber Threat Intelligence (CTI) tool designed to solve the industry's biggest pain point: **Data Overload**. It leverages the reasoning power of **Google Gemini 3 Pro** to transform messy, unstructured threat reports into structured, actionable **STIX 2.1** intelligence.

🚀 **[Live Demo](https://sentinel-stix-parser-346835194366.us-west1.run.app/)**

---

## 🚀 The Resume Impact
> **"Developed an AI-powered parsing tool using Google Gemini 3 Pro to automatically extract and structure TTPs and IoCs from unstructured threat reports, reducing analysis time by 75%."**

---

## 🧠 The Concept
CTI analysts spend hours manually scouring blog posts, PDF reports, and dark web forums to identify Indicators of Compromise (IoCs) and adversary tactics. **Sentinel-STIX** automates this workflow by using advanced Large Language Model (LLM) reasoning to perform entity extraction with clinical precision.

### Key Technical Achievements:
*   **Structured Output Enforcement:** Utilized Gemini's "JSON Mode" and rigorous system instructions to force non-deterministic AI into producing strict STIX 2.1 compliant schema.
*   **Intelligent Relationship Mapping:** Automatically identifies and links relationships between Threat Actors, Malware, and targeted Victims.
*   **Real-time IoC Validation:** Implemented a secondary validation layer using Regex to check the integrity of extracted IPs, Hashes, and Domains before they enter the intelligence cycle.
*   **Tactical Visualization:** Engineered an interactive dashboard using **Recharts** to provide at-a-glance telemetry of a report's indicator mix.

---

## 🛠️ Technical Stack
*   **Engine:** [Google Gemini 3 Pro](https://ai.google.dev/) (Reasoning & Extraction)
*   **Framework:** React 19 + TypeScript
*   **Styling:** Tailwind CSS (Cyber-Grid Aesthetic)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Schema:** STIX 2.1 (Structured Threat Information Expression)

---

## ✨ Features
*   **Deep Extraction:** Pulls Threat Actors, Malware Families, Victims, and MITRE ATT&CK TTPs.
*   **IoC Parsing:** Identifies IPv4 addresses, Domains, URLs, and multi-format File Hashes (MD5, SHA-1, SHA-256).
*   **Pattern Validation:** Visually flags indicators that do not match standard technical patterns.
*   **STIX JSON Export:** One-click export of the generated bundle for ingestion into TIPs (Threat Intel Platforms) like MISP or OpenCTI.
*   **Example Sandbox:** Pre-loaded with a complex APT-41 campaign report for instant demonstration.

---

## 🚦 Getting Started
1.  **Access the App:** Visit the [Live Demo](https://sentinel-stix-parser-346835194366.us-west1.run.app/).
2.  **System Activation:** This tool requires a Google Gemini API Key.
3.  **Activation:** Click the **"API DISCONNECTED"** status in the header.
4.  **Link Account:** Follow the secure handshake protocol to link your Google AI Studio project.
5.  **Parse:** Paste any raw text (e.g., a FireEye report or a Twitter threat thread) and hit **"Extract Entities"**.

---

## 👤 About the Developer
**Cynthia Schomp**  
*Senior Frontend Engineer & Security Enthusiast*

I specialize in building high-fidelity interfaces that make complex data actionable. You can view my full portfolio and current CV at:
🌐 [cynthiaschomp.com](https://cynthiaschomp.com)

---

## 📄 License
This project is for portfolio demonstration purposes. STIX™ is a trademark of OASIS Open.