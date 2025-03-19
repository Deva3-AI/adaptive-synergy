
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import logging

from database import get_db
import models
import schemas
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

@router.post("/analyze-meeting", response_model=schemas.MeetingAnalysisResponse)
async def analyze_meeting(
    request: schemas.MeetingAnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze meeting transcript to extract action items and insights"""
    result = AIService.analyze_meeting_transcript(
        transcript=request.transcript,
        meeting_type=request.meeting_type
    )
    
    return result

@router.post("/campaign-insights", response_model=schemas.MarketingInsightResponse)
async def get_campaign_insights(
    request: schemas.MarketingInsightRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate insights from marketing campaign data"""
    result = AIService.generate_marketing_insights(
        campaign_data=request.campaign_data,
        market_segment=request.market_segment
    )
    
    return result

@router.post("/generate-email-copy", response_model=Dict[str, Any])
async def generate_email_copy(
    campaign_type: str,
    target_audience: str,
    key_points: List[str],
    tone: Optional[str] = "professional",
    current_user: models.User = Depends(get_current_user)
):
    """Generate email marketing copy with AI"""
    try:
        # Combine key points into a string
        key_points_text = "\n".join([f"- {point}" for point in key_points])
        
        # Create prompt for OpenAI
        prompt = f"""
        Generate a marketing email with:
        
        Campaign Type: {campaign_type}
        Target Audience: {target_audience}
        Tone: {tone}
        
        Key Points to Include:
        {key_points_text}
        
        Format the response with:
        1. Subject line
        2. Email body with proper greeting and sign-off
        3. Call-to-action suggestion
        """
        
        # Call OpenAI API
        import openai
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "You are a professional marketing copywriter specialized in email marketing."},
                      {"role": "user", "content": prompt}]
        )
        
        email_copy = response.choices[0].message.content.strip()
        
        # Extract subject line (assuming it's in the first line or marked with "Subject:")
        lines = email_copy.split('\n')
        subject_line = ""
        body = email_copy
        
        for i, line in enumerate(lines):
            if "subject" in line.lower() or "subject line" in line.lower():
                subject_parts = line.split(":", 1)
                if len(subject_parts) > 1:
                    subject_line = subject_parts[1].strip()
                    body = '\n'.join(lines[i+1:]).strip()
                break
            elif i == 0:  # First line might be the subject
                subject_line = line.strip()
                body = '\n'.join(lines[1:]).strip()
                break
        
        return {
            "subject_line": subject_line,
            "email_body": body,
            "campaign_type": campaign_type,
            "target_audience": target_audience,
            "tone": tone
        }
        
    except Exception as e:
        logging.error(f"Error generating email copy: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating email copy"
        )

@router.post("/analyze-market-trends", response_model=Dict[str, Any])
async def analyze_market_trends(
    industry: str,
    keywords: List[str],
    time_period: Optional[str] = "last 3 months",
    current_user: models.User = Depends(get_current_user)
):
    """Analyze market trends based on industry and keywords"""
    try:
        # Create prompt for OpenAI
        keywords_text = ", ".join(keywords)
        
        prompt = f"""
        Analyze current market trends for:
        
        Industry: {industry}
        Key Focus Areas: {keywords_text}
        Time Period: {time_period}
        
        Provide:
        1. Top 5 emerging trends in this industry
        2. 3 potential opportunities for marketing campaigns
        3. 2 potential threats or challenges
        4. Recommendations for marketing strategy
        
        Format as JSON with these keys:
        - emerging_trends (array)
        - opportunities (array of objects with "title" and "description")
        - challenges (array of objects with "title" and "description")
        - recommendations (array)
        """
        
        # Call OpenAI API
        import openai
        import json
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "You are a market research analyst specializing in identifying industry trends and providing marketing insights. Always respond with valid JSON."},
                      {"role": "user", "content": prompt}]
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Extract JSON if embedded in text
        import re
        json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)
        
        analysis = json.loads(response_text)
        
        # Add metadata
        analysis["metadata"] = {
            "industry": industry,
            "keywords": keywords,
            "time_period": time_period,
            "generated_at": datetime.now().isoformat()
        }
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error analyzing market trends: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error analyzing market trends"
        )
