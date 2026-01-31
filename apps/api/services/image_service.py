from PIL import Image
import pytesseract
import os
from core.config import settings
import uuid

class ImageService:
    def __init__(self, storage_path: str = settings.STORAGE_PATH):
        self.upload_path = f"{storage_path}/uploads"
        self.download_path = f"{storage_path}/downloads"
        os.makedirs(self.upload_path, exist_ok=True)
        os.makedirs(self.download_path, exist_ok=True)

    def process_image(self, input_path: str, action: str, params: dict = None):
        """
        Process image using Pillow (resize, rotate, convert format)
        """
        filename = os.path.basename(input_path)
        base_name = os.path.splitext(filename)[0]
        
        with Image.open(input_path) as img:
            if action == "resize":
                width = params.get("width", img.width)
                height = params.get("height", img.height)
                img = img.resize((width, height), Image.Resampling.LANCZOS)
            elif action == "rotate":
                degrees = params.get("degrees", 90)
                img = img.rotate(degrees, expand=True)
            elif action == "grayscale":
                img = img.convert("L")
            
            target_format = params.get("format", img.format or "PNG").upper()
            output_filename = f"{base_name}_{action}.{target_format.lower()}"
            output_path = os.path.join(self.download_path, output_filename)
            
            img.save(output_path, format=target_format)
            
            return {
                "status": "success",
                "filename": output_filename,
                "path": output_path,
                "action": action
            }

    def extract_text(self, input_path: str, lang: str = "eng"):
        """
        Extract text from image using Tesseract OCR
        """
        try:
            with Image.open(input_path) as img:
                text = pytesseract.image_to_string(img, lang=lang)
                return {
                    "status": "success",
                    "text": text,
                    "lang": lang
                }
        except Exception as e:
            raise Exception(f"OCR failed: {str(e)}")

image_service = ImageService()
