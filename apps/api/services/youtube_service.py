import yt_dlp
import os
import uuid

class YouTubeService:
    def __init__(self, download_path: str = "/storage/downloads"):
        self.download_path = download_path
        os.makedirs(self.download_path, exist_ok=True)

    def download_video(self, url: str, format: str = "mp4", quality: str = "best"):
        task_id = str(uuid.uuid4())
        
        # Configure yt-dlp options
        ydl_opts = {
            'format': f'{quality}video+{quality}audio/best' if format == 'mp4' else 'bestaudio/best',
            'outtmpl': f'{self.download_path}/%(title)s.%(ext)s',
            'merge_output_format': format,
            'noplaylist': True,
            'quiet': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
                
                # If merged, update extension
                if format == 'mp4' and not filename.endswith('.mp4'):
                     base = os.path.splitext(filename)[0]
                     filename = f"{base}.mp4"

                return {
                    "status": "success",
                    "title": info.get('title', 'Unknown'),
                    "filename": os.path.basename(filename),
                    "path": filename
                }
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")

youtube_service = YouTubeService()
