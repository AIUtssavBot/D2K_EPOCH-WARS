from fastapi import APIRouter, Depends, HTTPException
from app.ml.prediction_model.prediction_model import predict
from app.schemas.prediction import PredictionInput, PredictionOutput
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Prediction"])

@router.post("/predict", response_model=PredictionOutput)
async def predict_task_status(
    input_data: PredictionInput, 
    current_user: dict = Depends(get_current_user)
):
    try:
        prediction = predict(input_data.model_dump())
        return {"status": prediction}
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during prediction: {str(e)}"
        )