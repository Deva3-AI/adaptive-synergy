
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging

from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/analyze-client-input")
async def analyze_client_input(data: Dict[str, Any] = Body(...)):
    """
    Analyze client input to extract requirements, sentiment, and priority.
    """
    try:
        text = data.get("text", "")
        client_history = data.get("client_history")
        platform_data = data.get("platform_data")
        
        if not text and not platform_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either text or platform_data is required"
            )
        
        result = ai_service.analyze_client_input(text, client_history, platform_data)
        return result
    except Exception as e:
        logging.error(f"Error in analyze-client-input: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing client input: {str(e)}"
        )

@router.post("/analyze-platform-messages")
async def analyze_platform_messages(data: Dict[str, Any] = Body(...)):
    """
    Analyze messages from external platforms (Slack, Discord, etc.)
    """
    try:
        messages = data.get("messages", [])
        client_name = data.get("client_name")
        
        if not messages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Messages are required"
            )
        
        result = ai_service.analyze_platform_messages(messages, client_name)
        return result
    except Exception as e:
        logging.error(f"Error in analyze-platform-messages: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing platform messages: {str(e)}"
        )

@router.post("/predict-task-timeline")
async def predict_task_timeline(data: Dict[str, Any] = Body(...)):
    """
    Predict task timeline based on task description and historical data.
    """
    try:
        task_description = data.get("task_description", "")
        client_history = data.get("client_history")
        
        if not task_description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description is required"
            )
        
        result = ai_service.predict_task_timeline(task_description, client_history)
        return result
    except Exception as e:
        logging.error(f"Error in predict-task-timeline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting task timeline: {str(e)}"
        )

@router.post("/analyze-meeting-transcript")
async def analyze_meeting_transcript(data: Dict[str, Any] = Body(...)):
    """
    Analyze meeting transcript to extract summary, action items, and insights.
    """
    try:
        transcript = data.get("transcript", "")
        meeting_type = data.get("meeting_type", "client")
        
        if not transcript:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transcript is required"
            )
        
        result = ai_service.analyze_meeting_transcript(transcript, meeting_type)
        return result
    except Exception as e:
        logging.error(f"Error in analyze-meeting-transcript: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing meeting transcript: {str(e)}"
        )

@router.post("/generate-marketing-insights")
async def generate_marketing_insights(data: Dict[str, Any] = Body(...)):
    """
    Generate marketing insights from campaign data.
    """
    try:
        campaign_data = data.get("campaign_data", {})
        market_segment = data.get("market_segment")
        
        if not campaign_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Campaign data is required"
            )
        
        result = ai_service.generate_marketing_insights(campaign_data, market_segment)
        return result
    except Exception as e:
        logging.error(f"Error in generate-marketing-insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating marketing insights: {str(e)}"
        )

@router.post("/analyze-financial-data")
async def analyze_financial_data(data: Dict[str, Any] = Body(...)):
    """
    Analyze financial records to generate insights and predictions.
    """
    try:
        financial_records = data.get("financial_records", [])
        
        if not financial_records:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Financial records are required"
            )
        
        result = ai_service.analyze_financial_data(financial_records)
        return result
    except Exception as e:
        logging.error(f"Error in analyze-financial-data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing financial data: {str(e)}"
        )

@router.post("/analyze-employee-performance")
async def analyze_employee_performance(data: Dict[str, Any] = Body(...)):
    """
    Analyze employee performance based on attendance and task completion.
    """
    try:
        attendance_data = data.get("attendance_data", [])
        task_data = data.get("task_data", [])
        
        if not attendance_data and not task_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either attendance data or task data is required"
            )
        
        result = ai_service.analyze_employee_performance(attendance_data, task_data)
        return result
    except Exception as e:
        logging.error(f"Error in analyze-employee-performance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing employee performance: {str(e)}"
        )

@router.post("/generate-suggested-tasks")
async def generate_suggested_tasks(data: Dict[str, Any] = Body(...)):
    """
    Generate suggested tasks based on client requirements.
    """
    try:
        client_requirements = data.get("client_requirements", "")
        client_id = data.get("client_id")
        platform_data = data.get("platform_data")
        
        if not client_requirements and not platform_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either client requirements or platform data is required"
            )
        
        if platform_data:
            # Use platform-specific analysis
            result = ai_service.analyze_platform_messages(platform_data, str(client_id))
        else:
            # Use regular analysis
            result = ai_service.analyze_client_input(client_requirements)
        
        return result
    except Exception as e:
        logging.error(f"Error in generate-suggested-tasks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating suggested tasks: {str(e)}"
        )

@router.post("/generate-performance-insights")
async def generate_performance_insights(data: Dict[str, Any] = Body(...)):
    """
    Generate performance improvement insights for employees.
    """
    try:
        employee_id = data.get("employee_id")
        
        if not employee_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee ID is required"
            )
        
        # This would typically fetch employee data from database
        # For now, we'll simulate it
        
        # Mock data for demonstration
        attendance_data = []
        task_data = []
        
        result = ai_service.analyze_employee_performance(attendance_data, task_data)
        return result
    except Exception as e:
        logging.error(f"Error in generate-performance-insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating performance insights: {str(e)}"
        )
