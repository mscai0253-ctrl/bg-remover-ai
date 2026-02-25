# AI Background Remover Pro

A full-stack AI-powered background removal web application built using FastAPI and rembg.

This project removes image backgrounds using deep learning (U2Net model) and provides a clean, minimal Apple-inspired user interface.

---

## 🚀 Features

- AI-based background removal
- Transparent background export
- Custom background color mode
- Drag & Drop image upload
- Batch image processing
- Original vs Processed view toggle
- Image size statistics
- Dimension display
- Processing time measurement
- Dark / Light mode toggle
- Clean Apple-style minimal UI

---

## 🛠 Tech Stack

### 🔹 Backend
- FastAPI
- rembg (U2Net model)
- ONNX Runtime
- Pillow
- Python 3.11

### 🔹 Frontend
- HTML5
- CSS3 (Minimal UI design)
- Vanilla JavaScript
- Canvas API (for background rendering)

---

## 🧠 How It Works

1. User uploads image(s)
2. Frontend sends image to FastAPI backend
3. Backend processes image using U2Net model
4. Transparent PNG is returned
5. Frontend renders image on canvas
6. User can:
   - Download transparent PNG
   - Apply custom background color
   - Toggle between original and processed view

---

## 📂 Project Structure
