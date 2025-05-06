from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import matplotlib.pyplot as plt
import numpy as np
import os
import base64
from io import BytesIO
from datetime import datetime
from matplotlib.patches import Rectangle

app = Flask(__name__)
app.secret_key = 'prt_assessment_secret_key'  # Required for session

class PRTAssessment:
    def __init__(self):
        self.questions = [
            "Do you find it difficult to consistently assess and document the condition of a unit before move-in and after move-out?",
            "Are you currently not using a standardized tool or checklist to monitor the physical condition of properties over time?",
            "Do you rely on manual methods or fragmented tools to keep track of critical dates like rent due dates, lease renewals, or maintenance schedules??",
            "Do you lack a centralized dashboard that gives you a clear, real-time view of rent collection across all your properties?",
            "Do you experience frequent communication gaps between tenants, maintenance teams, and property owners?"
        ]
        
        self.results_explanation = {
            "low": "LOW SEVERITY (0-49%): The property issue appears to be minor and localized. "
                  "It likely doesn't pose immediate risks to tenants or significant financial impact. "
                  "Standard maintenance procedures should be sufficient to address the problem.",
            
            "medium": "MODERATE SEVERITY (50-79%): The property issue requires attention within a reasonable timeframe. "
                     "While not an emergency, this level of severity could escalate if left unaddressed. "
                     "Consider allocating resources to resolve these issues within the next 1-2 weeks.",
            
            "high": "HIGH SEVERITY (80-100%): The property issue demands immediate attention. "
                   "These problems likely affect multiple tenants, pose safety risks, or cause financial damage. "
                   "Prioritize these issues and consider engaging specialized contractors or services to resolve them promptly."
        }
    
    def calculate_score(self, answers):
        """Calculate the score based on answers"""
        score = sum(answers)
        score_percentage = (score / len(self.questions)) * 100
        return score, score_percentage
    
    def determine_severity(self, score_percentage):
        """Determine the severity level based on score percentage"""
        if score_percentage < 50:
            return "low"
        elif score_percentage < 80:
            return "medium"
        else:
            return "high"
    
    def generate_thermometer_image(self, score_percentage, severity_level):
        """Create a thermometer visualization of the score and return as base64 string"""
        # Create figure and axis
        fig, ax = plt.subplots(figsize=(10, 6), facecolor='#f8f9fa')
        
        # Set up the thermometer background
        thermometer_height = 0.6
        thermometer_width = 0.15
        bulb_radius = thermometer_width/1.5
        
        # Draw thermometer outline
        ax.add_patch(Rectangle((0.3, 0.2), thermometer_width, thermometer_height, 
                              fill=False, edgecolor='black', linewidth=2))
        
        # Draw thermometer bulb
        bulb_circle = plt.Circle((0.3 + thermometer_width/2, 0.2), bulb_radius, 
                                fill=False, edgecolor='black', linewidth=2)
        ax.add_patch(bulb_circle)
        
        # Calculate fill height based on score
        fill_height = (score_percentage / 100) * thermometer_height
        
        # Create gradient colors for the thermometer
        if score_percentage < 50:
            color = 'red'
        elif score_percentage < 80:
            color = 'orange'
        else:
            color = 'green'
            
        # Fill the thermometer based on score
        ax.add_patch(Rectangle((0.3, 0.2), thermometer_width, fill_height, 
                              fill=True, color=color))
        
        # Fill the bulb with the same color
        bulb_fill = plt.Circle((0.3 + thermometer_width/2, 0.2), bulb_radius-0.01, 
                              fill=True, color=color)
        ax.add_patch(bulb_fill)
        
        # Add temperature markings
        for i in range(0, 101, 20):
            y_pos = 0.2 + (i/100) * thermometer_height
            ax.plot([0.3-0.02, 0.3], [y_pos, y_pos], 'k-', linewidth=1)
            ax.text(0.25, y_pos, f"{i}%", ha='right', va='center')
        
        # Add score text
        ax.text(0.3 + thermometer_width/2, 0.85, f"Score: {score_percentage:.1f}%", 
                ha='center', va='center', fontsize=14, fontweight='bold')
        
        # Add severity level
        severity_text = f"Severity: {severity_level.upper()}"
        ax.text(0.3 + thermometer_width/2, 0.9, severity_text, 
                ha='center', va='center', fontsize=16, fontweight='bold')
        
        # Add explanation text
        explanation = self.results_explanation[severity_level]
        ax.text(0.7, 0.5, explanation, ha='left', va='center', 
                fontsize=10, wrap=True, bbox=dict(facecolor='white', alpha=0.8))
        
        # Add title
        ax.text(0.5, 0.95, "PRT ASSESSMENT RESULTS", ha='center', va='center', 
                fontsize=18, fontweight='bold')
        
        # Add legend for all severity levels
        legend_y = 0.15
        for level, color, text in [
            ("HIGH", "green", self.results_explanation["high"]),
            ("MEDIUM", "orange", self.results_explanation["medium"]),
            ("LOW", "red", self.results_explanation["low"])
        ]:
            ax.add_patch(Rectangle((0.55, legend_y), 0.02, 0.02, fill=True, color=color))
            ax.text(0.58, legend_y+0.01, f"{level}: {text[:30]}...", 
                    ha='left', va='center', fontsize=8)
            legend_y -= 0.03
        
        # Set axis limits and remove ticks
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        
        # Convert plot to base64 string
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_png = buffer.getvalue()
        buffer.close()
        plt.close()
        
        # Encode the image to base64 string
        encoded = base64.b64encode(image_png).decode('utf-8')
        return encoded
    
    def save_results(self, answers, score, score_percentage, severity_level):
        """Save the assessment results to a JSON file"""
        results = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "questions": self.questions,
            "answers": ["Yes" if a == 1 else "No" for a in answers],
            "score": score,
            "score_percentage": score_percentage,
            "severity_level": severity_level,
            "explanation": self.results_explanation[severity_level]
        }
        
        # Create directory if it doesn't exist
        os.makedirs('results', exist_ok=True)
        
        # Generate a unique filename based on timestamp
        filename = f"results/prt_assessment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=4)
            
        return filename

# Initialize the assessment
assessment = PRTAssessment()

@app.route('/')
def index():
    # Reset session data for a new assessment
    session.clear()
    session['current_question'] = 0
    session['answers'] = []
    return render_template('index.html')

@app.route('/question', methods=['GET', 'POST'])
def question():
    if request.method == 'POST':
        # Process the answer
        answer = request.form.get('answer')
        
        if 'answers' not in session:
            session['answers'] = []
        
        if answer == 'yes':
            session['answers'].append(1)
        else:
            session['answers'].append(0)
        
        session['current_question'] = session.get('current_question', 0) + 1
        
        # Check if all questions have been answered
        if session['current_question'] >= len(assessment.questions):
            return redirect(url_for('results'))
    
    # Get the current question
    current_question = session.get('current_question', 0)
    
    # Check if we have questions left
    if current_question < len(assessment.questions):
        question_text = assessment.questions[current_question]
        question_number = current_question + 1
        return render_template('question.html', 
                              question=question_text, 
                              question_number=question_number,
                              total_questions=len(assessment.questions))
    else:
        return redirect(url_for('results'))

@app.route('/results')
def results():
    # Get answers from session
    answers = session.get('answers', [])
    
    # Calculate results
    score, score_percentage = assessment.calculate_score(answers)
    severity_level = assessment.determine_severity(score_percentage)
    
    # Generate thermometer image
    thermometer_image = assessment.generate_thermometer_image(score_percentage, severity_level)
    
    # Save results to JSON
    filename = assessment.save_results(answers, score, score_percentage, severity_level)
    
    # Prepare data for the template
    results_data = {
        "score": score,
        "score_percentage": score_percentage,
        "severity_level": severity_level.upper(),
        "explanation": assessment.results_explanation[severity_level],
        "thermometer_image": thermometer_image,
        "filename": filename,
        "all_explanations": assessment.results_explanation
    }
    
    return render_template('results.html', results=results_data)

@app.route('/restart')
def restart():
    # Clear session and start over
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
