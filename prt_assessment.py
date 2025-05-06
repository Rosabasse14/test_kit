import json
import matplotlib.pyplot as plt
import numpy as np
import os
from datetime import datetime
from matplotlib.patches import Rectangle

class PRTAssessment:
    def __init__(self):
        self.questions = [
            "Is the issue affecting multiple tenants or units simultaneously?",
            "Has the problem persisted for more than 14 days?",
            "Is the issue causing financial loss (e.g., property damage, lost rent)?",
            "Does the problem pose health or safety risks to occupants?",
            "Have previous attempts to resolve the issue failed?"
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
        
        self.answers = []
        self.score = 0
        self.score_percentage = 0
        self.severity_level = ""
        
    def run_assessment(self):
        """Run the questionnaire and display results"""
        print("\n" + "="*50)
        print("🏢 PRT ASSESSMENT - PROPERTY PROBLEM SEVERITY ANALYZER 🏢")
        print("="*50)
        print("\nAnswer the following questions about the property issue:")
        
        for i, question in enumerate(self.questions, 1):
            while True:
                answer = input(f"\nQ{i}: {question} (yes/no): ").lower().strip()
                if answer in ["yes", "no"]:
                    self.answers.append(1 if answer == "yes" else 0)
                    break
                else:
                    print("Please enter 'yes' or 'no'.")
        
        self.calculate_score()
        self.determine_severity()
        self.display_results()
        self.save_results()
        
    def calculate_score(self):
        """Calculate the score based on answers"""
        self.score = sum(self.answers)
        self.score_percentage = (self.score / len(self.questions)) * 100
        
    def determine_severity(self):
        """Determine the severity level based on score percentage"""
        if self.score_percentage < 50:
            self.severity_level = "low"
        elif self.score_percentage < 80:
            self.severity_level = "medium"
        else:
            self.severity_level = "high"
            
    def draw_thermometer(self):
        """Create a thermometer visualization of the score"""
        # Create figure and axis
        fig, ax = plt.subplots(figsize=(10, 6))
        
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
        fill_height = (self.score_percentage / 100) * thermometer_height
        
        # Create gradient colors for the thermometer
        if self.score_percentage < 50:
            color = 'red'
        elif self.score_percentage < 80:
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
        ax.text(0.3 + thermometer_width/2, 0.85, f"Score: {self.score_percentage:.1f}%", 
                ha='center', va='center', fontsize=14, fontweight='bold')
        
        # Add severity level
        severity_text = f"Severity: {self.severity_level.upper()}"
        ax.text(0.3 + thermometer_width/2, 0.9, severity_text, 
                ha='center', va='center', fontsize=16, fontweight='bold')
        
        # Add explanation text
        explanation = self.results_explanation[self.severity_level]
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
        
        plt.tight_layout()
        plt.savefig('prt_assessment_result.png', dpi=300, bbox_inches='tight')
        plt.close()
        
    def display_results(self):
        """Display the assessment results"""
        print("\n" + "="*50)
        print("ASSESSMENT RESULTS")
        print("="*50)
        print(f"Score: {self.score_percentage:.1f}%")
        print(f"Severity Level: {self.severity_level.upper()}")
        print("\nExplanation:")
        print(self.results_explanation[self.severity_level])
        
        # Generate and display the thermometer visualization
        self.draw_thermometer()
        print("\nThermometer visualization saved as 'prt_assessment_result.png'")
        
    def save_results(self):
        """Save the assessment results to a JSON file"""
        results = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "questions": self.questions,
            "answers": ["Yes" if a == 1 else "No" for a in self.answers],
            "score": self.score,
            "score_percentage": self.score_percentage,
            "severity_level": self.severity_level,
            "explanation": self.results_explanation[self.severity_level]
        }
        
        with open('prt_assessment_results.json', 'w') as f:
            json.dump(results, f, indent=4)
            
        print("\nResults saved to 'prt_assessment_results.json'")

if __name__ == "__main__":
    assessment = PRTAssessment()
    assessment.run_assessment()
