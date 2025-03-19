
import os
import logging
from typing import List, Dict, Any, Optional
import json
import openai
from datetime import datetime
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")

# Download NLTK resources if not already present
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

class AIService:
    @staticmethod
    def analyze_client_input(text: str, client_history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Analyze client input using NLP to extract requirements, sentiment, and priority.
        """
        try:
            # Extract key requirements using OpenAI
            requirements_prompt = f"Extract the key requirements or tasks from this client input:\n\n{text}\n\nList only the requirements, one per line."
            requirements_response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that extracts key requirements from client inputs."},
                          {"role": "user", "content": requirements_prompt}]
            )
            requirements_text = requirements_response.choices[0].message.content.strip()
            requirements = [req.strip() for req in requirements_text.split('\n') if req.strip()]
            
            # Analyze sentiment
            sentiment_scores = sia.polarity_scores(text)
            if sentiment_scores['compound'] >= 0.05:
                sentiment = "positive"
            elif sentiment_scores['compound'] <= -0.05:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            # Determine priority based on urgency words and sentiment
            urgency_words = ["urgent", "asap", "immediately", "critical", "crucial", "emergency"]
            priority_score = 0
            for word in urgency_words:
                if word in text.lower():
                    priority_score += 1
            
            # Adjust priority based on sentiment
            if sentiment == "negative":
                priority_score += 1
            
            if priority_score >= 2:
                priority = "high"
            elif priority_score == 1:
                priority = "medium"
            else:
                priority = "low"
            
            # Generate suggested tasks using OpenAI
            tasks_prompt = f"Based on this client input:\n\n{text}\n\nGenerate 3-5 actionable tasks that should be created. For each task, provide a title, brief description, and estimated hours to complete."
            tasks_response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that generates actionable tasks from client requirements."},
                          {"role": "user", "content": tasks_prompt}]
            )
            tasks_text = tasks_response.choices[0].message.content.strip()
            
            # Parse the tasks
            suggested_tasks = []
            for line in tasks_text.split('\n'):
                if line and ':' in line:
                    # Assuming format like "Task Title: Description (X hours)"
                    parts = line.split(':')
                    if len(parts) >= 2:
                        title = parts[0].strip()
                        desc_with_hours = ':'.join(parts[1:]).strip()
                        
                        # Extract hours
                        import re
                        hours_match = re.search(r'(\d+\.?\d*)\s*hours?', desc_with_hours)
                        estimated_hours = float(hours_match.group(1)) if hours_match else None
                        
                        # Clean description
                        description = desc_with_hours
                        if hours_match:
                            description = description.replace(hours_match.group(0), '').strip()
                        
                        suggested_tasks.append({
                            "title": title,
                            "description": description,
                            "estimated_time": estimated_hours
                        })
            
            return {
                "key_requirements": requirements,
                "sentiment": sentiment,
                "priority_level": priority,
                "suggested_tasks": suggested_tasks
            }
            
        except Exception as e:
            logging.error(f"Error analyzing client input: {str(e)}")
            return {
                "key_requirements": [],
                "sentiment": "neutral",
                "priority_level": "medium",
                "suggested_tasks": []
            }
    
    @staticmethod
    def predict_task_timeline(task_description: str, client_history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Predict task timeline and complexity based on description and historical data.
        """
        try:
            # Use OpenAI to analyze the task
            prompt = f"""
            Analyze this task description and provide the following information:
            1. Estimated hours to complete
            2. Task complexity (simple, moderate, complex)
            3. Required skills (list of 3-5 key skills)
            4. Potential challenges or roadblocks
            
            Task Description: {task_description}
            
            Format the response as valid JSON with these fields: 
            estimated_time (number), 
            task_complexity (string), 
            recommended_skills (array of strings), 
            potential_challenges (array of strings)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that analyzes tasks and provides structured information. Always respond with valid JSON."},
                          {"role": "user", "content": prompt}]
            )
            
            # Extract and parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if embedded in text
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            
            analysis = json.loads(response_text)
            
            return {
                "estimated_time": float(analysis.get("estimated_time", 2.0)),
                "task_complexity": analysis.get("task_complexity", "moderate"),
                "recommended_skills": analysis.get("recommended_skills", []),
                "potential_challenges": analysis.get("potential_challenges", [])
            }
            
        except Exception as e:
            logging.error(f"Error predicting task timeline: {str(e)}")
            return {
                "estimated_time": 2.0,
                "task_complexity": "moderate",
                "recommended_skills": ["general"],
                "potential_challenges": ["No specific challenges identified"]
            }
    
    @staticmethod
    def analyze_meeting_transcript(transcript: str, meeting_type: str) -> Dict[str, Any]:
        """
        Analyze meeting transcript to extract summary, action items, and insights.
        """
        try:
            # Use OpenAI to analyze the meeting transcript
            prompt = f"""
            Analyze this {meeting_type} meeting transcript and provide:
            1. A brief summary (2-3 sentences)
            2. Key action items with assignee if mentioned (formatted as bullet points)
            3. Key insights or decisions (formatted as bullet points)
            4. A sentiment analysis (positive, neutral, negative)
            
            Transcript:
            {transcript}
            
            Format the response as valid JSON with these fields:
            summary (string),
            action_items (array of objects with "task" and "assignee" fields),
            key_insights (array of strings),
            sentiment_analysis (object with overall sentiment and confidence score)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that analyzes meeting transcripts and extracts key information. Always respond with valid JSON."},
                          {"role": "user", "content": prompt}]
            )
            
            # Extract and parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if embedded in text
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            
            analysis = json.loads(response_text)
            
            return {
                "summary": analysis.get("summary", "No summary available."),
                "action_items": analysis.get("action_items", []),
                "key_insights": analysis.get("key_insights", []),
                "sentiment_analysis": analysis.get("sentiment_analysis", {"sentiment": "neutral", "confidence": 0.5})
            }
            
        except Exception as e:
            logging.error(f"Error analyzing meeting transcript: {str(e)}")
            return {
                "summary": "Error analyzing transcript.",
                "action_items": [],
                "key_insights": [],
                "sentiment_analysis": {"sentiment": "neutral", "confidence": 0.5}
            }
    
    @staticmethod
    def generate_marketing_insights(campaign_data: Dict[str, Any], market_segment: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate marketing insights from campaign data.
        """
        try:
            # Prepare the prompt with campaign data and market segment
            prompt = f"""
            Analyze this marketing campaign data and provide insights:
            
            Campaign Data:
            {json.dumps(campaign_data, indent=2)}
            
            Market Segment: {market_segment if market_segment else 'General'}
            
            Please provide:
            1. Performance analysis (what worked, what didn't)
            2. Identified trends
            3. Optimization suggestions for future campaigns
            
            Format the response as valid JSON with these fields:
            performance_analysis (object with strengths and weaknesses),
            trend_identification (array of strings),
            optimization_suggestions (array of objects with "area" and "suggestion" fields)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a marketing analyst that provides data-driven insights. Always respond with valid JSON."},
                          {"role": "user", "content": prompt}]
            )
            
            # Extract and parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if embedded in text
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            
            analysis = json.loads(response_text)
            
            return {
                "performance_analysis": analysis.get("performance_analysis", {}),
                "trend_identification": analysis.get("trend_identification", []),
                "optimization_suggestions": analysis.get("optimization_suggestions", [])
            }
            
        except Exception as e:
            logging.error(f"Error generating marketing insights: {str(e)}")
            return {
                "performance_analysis": {"strengths": [], "weaknesses": []},
                "trend_identification": ["No trends identified"],
                "optimization_suggestions": []
            }
    
    @staticmethod
    def analyze_financial_data(financial_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze financial records to generate insights and predictions.
        """
        try:
            # Convert to DataFrame for analysis
            df = pd.DataFrame(financial_records)
            
            # Calculate basic metrics
            total_income = df[df['record_type'] == 'income']['amount'].sum()
            total_expenses = df[df['record_type'] == 'expense']['amount'].sum()
            net_profit = total_income - total_expenses
            profit_margin = (net_profit / total_income) * 100 if total_income > 0 else 0
            
            # Group by date for trend analysis
            if 'record_date' in df.columns:
                df['record_date'] = pd.to_datetime(df['record_date'])
                df['month'] = df['record_date'].dt.strftime('%Y-%m')
                monthly_data = df.groupby(['month', 'record_type'])['amount'].sum().unstack().fillna(0)
                
                # Calculate monthly profit
                if 'income' in monthly_data.columns and 'expense' in monthly_data.columns:
                    monthly_data['profit'] = monthly_data['income'] - monthly_data['expense']
                    
                    # Calculate growth rates
                    monthly_data['profit_growth'] = monthly_data['profit'].pct_change() * 100
                    
                    # Identify positive and negative trends
                    positive_months = monthly_data[monthly_data['profit_growth'] > 5].index.tolist()
                    negative_months = monthly_data[monthly_data['profit_growth'] < -5].index.tolist()
                    
                    # Last 3 months trend
                    recent_trend = "stable"
                    if len(monthly_data) >= 3:
                        last_3_months = monthly_data['profit_growth'].tail(3).mean()
                        if last_3_months > 5:
                            recent_trend = "positive"
                        elif last_3_months < -5:
                            recent_trend = "negative"
            
            # Use OpenAI for deeper analysis and recommendations
            prompt = f"""
            Analyze these financial metrics and provide business insights:
            
            Total Income: ${total_income}
            Total Expenses: ${total_expenses}
            Net Profit: ${net_profit}
            Profit Margin: {profit_margin:.2f}%
            Recent Trend (3 months): {recent_trend}
            
            Provide:
            1. A financial health assessment
            2. Key insights about the financial data
            3. Three specific recommendations to improve financial performance
            4. A simple prediction for the next quarter
            
            Format the response as valid JSON with these fields:
            financial_health (object with status and explanation),
            key_insights (array of strings),
            recommendations (array of objects with "area" and "action" fields),
            prediction (string)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a financial analyst that provides data-driven insights. Always respond with valid JSON."},
                          {"role": "user", "content": prompt}]
            )
            
            # Extract and parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if embedded in text
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            
            analysis = json.loads(response_text)
            
            return {
                "summary_metrics": {
                    "total_income": total_income,
                    "total_expenses": total_expenses,
                    "net_profit": net_profit,
                    "profit_margin": profit_margin,
                    "recent_trend": recent_trend
                },
                "financial_health": analysis.get("financial_health", {}),
                "key_insights": analysis.get("key_insights", []),
                "recommendations": analysis.get("recommendations", []),
                "prediction": analysis.get("prediction", "No prediction available")
            }
            
        except Exception as e:
            logging.error(f"Error analyzing financial data: {str(e)}")
            return {
                "summary_metrics": {
                    "total_income": 0,
                    "total_expenses": 0,
                    "net_profit": 0,
                    "profit_margin": 0,
                    "recent_trend": "unknown"
                },
                "financial_health": {"status": "unknown", "explanation": "Analysis error"},
                "key_insights": ["Error performing financial analysis"],
                "recommendations": [],
                "prediction": "Unable to generate prediction"
            }
    
    @staticmethod
    def analyze_employee_performance(attendance_data: List[Dict[str, Any]], task_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze employee performance based on attendance and task completion.
        """
        try:
            # Convert to DataFrames
            attendance_df = pd.DataFrame(attendance_data)
            task_df = pd.DataFrame(task_data)
            
            # Calculate attendance metrics
            attendance_df['login_time'] = pd.to_datetime(attendance_df['login_time'])
            attendance_df['logout_time'] = pd.to_datetime(attendance_df['logout_time'])
            attendance_df['work_date'] = pd.to_datetime(attendance_df['work_date'])
            
            # Calculate hours worked
            attendance_df['hours_worked'] = (attendance_df['logout_time'] - attendance_df['login_time']).dt.total_seconds() / 3600
            
            # Calculate punctuality (assuming workday starts at 9 AM)
            attendance_df['time_of_day'] = attendance_df['login_time'].dt.time
            attendance_df['is_late'] = attendance_df['time_of_day'] > pd.to_datetime('09:15:00').time()
            
            avg_hours_worked = attendance_df['hours_worked'].mean()
            punctuality_rate = 100 - (attendance_df['is_late'].mean() * 100)
            
            # Calculate task metrics
            task_completion_rate = 0
            avg_task_time = 0
            efficiency_rate = 0
            
            if not task_df.empty and 'status' in task_df.columns:
                task_completion_rate = (task_df['status'] == 'completed').mean() * 100
                
                if 'actual_time' in task_df.columns and 'estimated_time' in task_df.columns:
                    completed_tasks = task_df[task_df['status'] == 'completed']
                    if not completed_tasks.empty:
                        avg_task_time = completed_tasks['actual_time'].mean()
                        
                        # Calculate efficiency (estimated vs actual time)
                        completed_tasks['efficiency'] = completed_tasks['estimated_time'] / completed_tasks['actual_time']
                        efficiency_rate = completed_tasks['efficiency'].mean() * 100
            
            # Use AI to analyze the metrics and provide insights
            prompt = f"""
            Analyze these employee performance metrics and provide insights:
            
            Average Hours Worked per Day: {avg_hours_worked:.2f} hours
            Punctuality Rate: {punctuality_rate:.2f}%
            Task Completion Rate: {task_completion_rate:.2f}%
            Average Time per Task: {avg_task_time:.2f} hours
            Efficiency Rate (estimated vs actual time): {efficiency_rate:.2f}%
            
            Provide:
            1. A performance assessment
            2. Strengths based on these metrics
            3. Areas for improvement
            4. Specific recommendations to enhance productivity
            
            Format the response as valid JSON with these fields:
            performance_assessment (object with rating and explanation),
            strengths (array of strings),
            improvement_areas (array of strings),
            recommendations (array of strings)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are an HR analyst that provides balanced, data-driven insights about employee performance. Always respond with valid JSON."},
                          {"role": "user", "content": prompt}]
            )
            
            # Extract and parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if embedded in text
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            
            analysis = json.loads(response_text)
            
            return {
                "metrics": {
                    "avg_hours_worked": avg_hours_worked,
                    "punctuality_rate": punctuality_rate,
                    "task_completion_rate": task_completion_rate,
                    "avg_task_time": avg_task_time,
                    "efficiency_rate": efficiency_rate
                },
                "performance_assessment": analysis.get("performance_assessment", {}),
                "strengths": analysis.get("strengths", []),
                "improvement_areas": analysis.get("improvement_areas", []),
                "recommendations": analysis.get("recommendations", [])
            }
            
        except Exception as e:
            logging.error(f"Error analyzing employee performance: {str(e)}")
            return {
                "metrics": {
                    "avg_hours_worked": 0,
                    "punctuality_rate": 0,
                    "task_completion_rate": 0,
                    "avg_task_time": 0,
                    "efficiency_rate": 0
                },
                "performance_assessment": {"rating": "unknown", "explanation": "Analysis error"},
                "strengths": ["Unable to determine strengths"],
                "improvement_areas": ["Unable to determine improvement areas"],
                "recommendations": ["Unable to generate recommendations"]
            }
