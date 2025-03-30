
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import logging
import json

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
    try:
        result = AIService.analyze_meeting_transcript(
            transcript=request.transcript,
            meeting_type=request.meeting_type
        )
        
        # Log the analysis for future model improvements
        logging.info(f"Meeting analysis completed for type: {request.meeting_type}")
        
        return result
    except Exception as e:
        logging.error(f"Error analyzing meeting transcript: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing meeting transcript: {str(e)}"
        )

@router.post("/campaign-insights", response_model=schemas.MarketingInsightResponse)
async def get_campaign_insights(
    request: schemas.MarketingInsightRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate insights from marketing campaign data"""
    try:
        result = AIService.generate_marketing_insights(
            campaign_data=request.campaign_data,
            market_segment=request.market_segment
        )
        
        # Store insights in database for historical reference
        new_insight = models.MarketingInsight(
            user_id=current_user.id,
            campaign_id=request.campaign_data.get("id"),
            insight_text=json.dumps(result.dict()),
            created_at=datetime.now()
        )
        db.add(new_insight)
        db.commit()
        
        return result
    except Exception as e:
        logging.error(f"Error generating campaign insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating campaign insights: {str(e)}"
        )

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
        
        # Create prompt for AI model
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
        
        # Call AI Service instead of direct OpenAI call
        email_copy = AIService.generate_text(prompt, context="email_marketing")
        
        # Parse the response to extract parts
        lines = email_copy.split('\n')
        subject_line = ""
        body = email_copy
        cta = ""
        
        # Extract subject line
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
        
        # Look for CTA
        for line in lines:
            if "call to action" in line.lower() or "cta" in line.lower():
                cta_parts = line.split(":", 1)
                if len(cta_parts) > 1:
                    cta = cta_parts[1].strip()
                    break
        
        # Log the generation for feedback collection
        logging.info(f"Email copy generated for campaign type: {campaign_type}, audience: {target_audience}")
        
        return {
            "subject_line": subject_line,
            "email_body": body,
            "cta_suggestion": cta,
            "campaign_type": campaign_type,
            "target_audience": target_audience,
            "tone": tone
        }
        
    except Exception as e:
        logging.error(f"Error generating email copy: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating email copy: {str(e)}"
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
        # Create prompt for AI model
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
        
        # Call AI Service instead of direct OpenAI call
        response_text = AIService.generate_structured_response(prompt, output_format="json")
        
        # Process and clean the response
        analysis = json.loads(response_text)
        
        # Add metadata
        analysis["metadata"] = {
            "industry": industry,
            "keywords": keywords,
            "time_period": time_period,
            "generated_at": datetime.now().isoformat(),
            "confidence_score": 0.85  # Mock confidence score
        }
        
        # Store the analysis in the database
        new_analysis = models.MarketTrendAnalysis(
            user_id=current_user.id,
            industry=industry,
            keywords=",".join(keywords),
            time_period=time_period,
            analysis_json=json.dumps(analysis),
            created_at=datetime.now()
        )
        db.add(new_analysis)
        db.commit()
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error analyzing market trends: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing market trends: {str(e)}"
        )

@router.post("/ai/enhance-email-template", response_model=Dict[str, Any])
async def enhance_email_template(
    template_id: int,
    improvement_focus: Optional[List[str]] = Query(["open_rate", "conversion", "engagement"]),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Use AI to enhance an existing email template for better performance"""
    try:
        # Get the template from database
        # In a real implementation, fetch from database
        template = {
            "id": template_id,
            "name": "Sample Template",
            "subject": "Special offer for [company_name]",
            "body": "Dear [first_name],\n\nWe wanted to let you know about our special offer...",
            "current_open_rate": 22.5,
            "current_click_rate": 3.8,
            "current_conversion_rate": 1.2
        }
        
        # Create prompt for AI
        improvement_focus_text = ", ".join(improvement_focus)
        
        prompt = f"""
        Enhance this email marketing template to improve {improvement_focus_text}.
        
        Current template:
        Subject: {template["subject"]}
        
        Body:
        {template["body"]}
        
        Current performance:
        - Open rate: {template["current_open_rate"]}%
        - Click rate: {template["current_click_rate"]}%
        - Conversion rate: {template["current_conversion_rate"]}%
        
        Provide:
        1. Improved subject line
        2. Improved email body
        3. Specific enhancements made
        4. Expected improvement in metrics
        
        Format as JSON with these keys:
        - improved_subject
        - improved_body
        - enhancements (array of improvements made)
        - expected_metrics (object with projected open_rate, click_rate, conversion_rate)
        """
        
        # Call AI Service
        response_text = AIService.generate_structured_response(prompt, output_format="json")
        enhancements = json.loads(response_text)
        
        # Add additional metadata
        enhancements["original_template_id"] = template_id
        enhancements["improvement_focus"] = improvement_focus
        enhancements["generated_at"] = datetime.now().isoformat()
        
        return enhancements
        
    except Exception as e:
        logging.error(f"Error enhancing email template: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error enhancing email template: {str(e)}"
        )

@router.post("/ai/analyze-campaign-performance", response_model=Dict[str, Any])
async def analyze_campaign_performance(
    campaign_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze marketing campaign performance data and provide AI-generated insights"""
    try:
        # In a real implementation, fetch campaign data from database
        campaign_data = {
            "id": campaign_id,
            "name": "Summer Product Launch",
            "type": "multi-channel",
            "budget": 15000,
            "start_date": "2023-06-01",
            "end_date": "2023-07-15",
            "metrics": {
                "impressions": 125000,
                "clicks": 8750,
                "conversions": 430,
                "revenue": 38500,
                "cost": 12800
            },
            "channel_performance": [
                {"channel": "email", "impressions": 45000, "clicks": 3200, "conversions": 180},
                {"channel": "social", "impressions": 62000, "clicks": 4100, "conversions": 160},
                {"channel": "display", "impressions": 18000, "clicks": 1450, "conversions": 90}
            ],
            "target_audience": "professionals aged 25-45"
        }
        
        # Format the prompt for AI analysis
        prompt = f"""
        Analyze the performance of this marketing campaign:
        
        Campaign: {campaign_data['name']} (ID: {campaign_data['id']})
        Type: {campaign_data['type']}
        Budget: ${campaign_data['budget']}
        Timeline: {campaign_data['start_date']} to {campaign_data['end_date']}
        Target Audience: {campaign_data['target_audience']}
        
        Performance Metrics:
        - Impressions: {campaign_data['metrics']['impressions']}
        - Clicks: {campaign_data['metrics']['clicks']}
        - Conversions: {campaign_data['metrics']['conversions']}
        - Revenue: ${campaign_data['metrics']['revenue']}
        - Cost: ${campaign_data['metrics']['cost']}
        - ROI: {(campaign_data['metrics']['revenue'] - campaign_data['metrics']['cost']) / campaign_data['metrics']['cost'] * 100:.1f}%
        
        Channel Performance:
        """ + "\n".join([
            f"- {c['channel'].title()}: {c['impressions']} impressions, {c['clicks']} clicks, {c['conversions']} conversions" 
            for c in campaign_data['channel_performance']
        ]) + """
        
        Provide:
        1. Performance summary
        2. Key insights (what worked, what didn't)
        3. Audience engagement analysis
        4. Channel effectiveness comparison 
        5. Recommendations for future campaigns
        6. Suggested A/B tests to improve performance
        
        Format as JSON with these keys:
        - summary
        - key_insights (array)
        - audience_analysis (object)
        - channel_analysis (array of channel objects)
        - recommendations (array)
        - suggested_tests (array)
        """
        
        # Call AI Service
        response_text = AIService.generate_structured_response(prompt, output_format="json")
        analysis = json.loads(response_text)
        
        # Add additional metadata
        analysis["campaign_id"] = campaign_id
        analysis["analysis_timestamp"] = datetime.now().isoformat()
        analysis["data_period"] = f"{campaign_data['start_date']} to {campaign_data['end_date']}"
        
        # Calculate some additional metrics
        analysis["calculated_metrics"] = {
            "ctr": campaign_data['metrics']['clicks'] / campaign_data['metrics']['impressions'] * 100,
            "conversion_rate": campaign_data['metrics']['conversions'] / campaign_data['metrics']['clicks'] * 100,
            "cost_per_acquisition": campaign_data['metrics']['cost'] / campaign_data['metrics']['conversions'],
            "revenue_per_acquisition": campaign_data['metrics']['revenue'] / campaign_data['metrics']['conversions']
        }
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error analyzing campaign performance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing campaign performance: {str(e)}"
        )
