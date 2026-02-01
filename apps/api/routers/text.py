from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import json
import base64
import difflib
import markdown
from xhtml2pdf import pisa
import os
import uuid
from core.config import settings

router = APIRouter()

class JsonRequest(BaseModel):
    data: str

class Base64Request(BaseModel):
    data: str
    action: str  # 'encode' or 'decode'

class MarkdownRequest(BaseModel):
    data: str
    target: str  # 'html' or 'pdf'

class DiffRequest(BaseModel):
    text1: str
    text2: str

@router.post("/json/format")
def format_json(request: JsonRequest):
    try:
        parsed = json.loads(request.data)
        return {"status": "success", "data": json.dumps(parsed, indent=2)}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

@router.post("/base64")
def base64_tool(request: Base64Request):
    try:
        if request.action == "encode":
            encoded = base64.b64encode(request.data.encode()).decode()
            return {"status": "success", "data": encoded}
        else:
            decoded = base64.b64decode(request.data).decode()
            return {"status": "success", "data": decoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Base64 error: {str(e)}")

@router.post("/diff")
def diff_checker(request: DiffRequest):
    d = difflib.HtmlDiff()
    diff_html = d.make_file(request.text1.splitlines(), request.text2.splitlines())
    return {"status": "success", "data": diff_html}

@router.post("/markdown")
def markdown_tool(request: MarkdownRequest):
    html = markdown.markdown(request.data)
    
    if request.target == "html":
        return {"status": "success", "data": html}
    
    # PDF Conversion
    filename = f"md_{uuid.uuid4()}.pdf"
    file_path = os.path.join(f"{settings.STORAGE_PATH}/downloads", filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, "w+b") as f:
        pisa_status = pisa.CreatePDF(html, dest=f)
        
    if pisa_status.err:
        raise HTTPException(status_code=500, detail="PDF conversion failed")
        
    return {"status": "success", "filename": filename}
