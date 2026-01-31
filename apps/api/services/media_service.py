import ffmpeg
import os
from core.config import settings

class MediaService:
    def __init__(self, storage_path: str = settings.STORAGE_PATH):
        self.upload_path = f"{storage_path}/uploads"
        self.download_path = f"{storage_path}/downloads"
        os.makedirs(self.upload_path, exist_ok=True)
        os.makedirs(self.download_path, exist_ok=True)

    def convert_file(self, input_path: str, target_format: str):
        filename = os.path.basename(input_path)
        base_name = os.path.splitext(filename)[0]
        output_filename = f"{base_name}.{target_format}"
        output_path = os.path.join(self.download_path, output_filename)

        try:
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.output(stream, output_path)
            ffmpeg.run(stream, overwrite_output=True, capture_stdout=True, capture_stderr=True)
            
            return {
                "status": "success",
                "original_file": filename,
                "filename": output_filename,
                "path": output_path
            }
        except ffmpeg.Error as e:
            error_message = e.stderr.decode('utf8') if e.stderr else str(e)
            raise Exception(f"Conversion failed: {error_message}")

media_service = MediaService()
