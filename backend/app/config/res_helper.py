from fastapi.responses import JSONResponse

def api_response(success: bool, message: str, result=None, errors=None, code: int = 200):
    return JSONResponse(
        status_code=code,
        content={
            "success": success,
            "message": message,
            "data": result,
            "error": errors or []
        }
    )