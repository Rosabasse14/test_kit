# PRT ASSESSMENT - Web-Based Property Problem Severity Analyzer

A web-based application for property management professionals to assess the severity of property-related issues.

## Features

- Interactive web-based questionnaire with 5 property management-focused questions
- Visual thermometer display showing severity levels:
  - Red: Less than 50% (Low severity)
  - Orange: 50-79% (Moderate severity)
  - Green: 80-100% (High severity)
- Detailed explanations for each severity level
- Results storage in JSON format
- Professional, responsive web interface

## Installation

1. Clone this repository
2. Install the required dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`
3. Run the application:
   \`\`\`
   python app.py
   \`\`\`
4. Open your web browser and navigate to `http://127.0.0.1:5000`

## Usage

1. Click "Start Assessment" on the home page
2. Answer each of the 5 questions with "Yes" or "No"
3. View your results with the thermometer visualization
4. Explore detailed explanations for all severity levels
5. Start a new assessment if needed

## Requirements

- Python 3.7+
- Flask
- Matplotlib
- NumPy
