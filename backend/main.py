from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_bg(
    file: UploadFile = File(...),
    bg_color: str = Form(None)
):
    input_bytes = await file.read()
    output_bytes = remove(input_bytes)

    img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

    # Apply background color safely
    if bg_color and bg_color.startswith("#"):
        background = Image.new("RGBA", img.size, bg_color)
        background.paste(img, mask=img.split()[3])
        img = background

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    return {"image": buffer.getvalue().hex()}