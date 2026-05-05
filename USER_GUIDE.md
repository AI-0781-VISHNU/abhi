# CellSight AI: User Guide

Welcome to **CellSight AI**. This manual will guide you through the features and usage of the platform, from image scanning to professional report generation.

---

## 🧭 Page-by-Page Navigation

### 1. Home / Dashboard
The landing page provides an overview of the system and quick access to the scanner.
- **Key Button**: `Start Analysis` - Takes you directly to the Health Scanner.

### 2. Health Scanner (Live Analysis)
This is the core feature of the platform where you perform cell analysis.

#### **Organ Selection Grid**
- **Usage**: Click on any organ icon (Lung, Breast, Kidney, etc.) to load the specific reference data for that organ.
- **Visual Feedback**: The selected organ will have a cyan border and a checkmark.

#### **Training Section (Top Right)**
Used to "teach" the system new cell patterns.
- **Upload Cancer Images**: Click to select malignant cell slides.
- **Upload Healthy Images**: Click to select normal cell slides.
- **Train Scanner**: Triggers the AI optimization process using OpenCV.

#### **Image Input Area**
- **Start Live Feed**: Activates your camera to scan a physical slide.
- **Upload Slide**: Allows you to pick a digital image file (.jpg, .png) for analysis.

#### **Analysis Report (Right Column)**
Appears after you upload/capture an image.
- **Diagnostic Result**: Shows "Cancer Detected" or "No Cancer Found".
- **Detection Accuracy**: A percentage showing the system's confidence in its finding.
- **Save Diagnostics Report (PDF)**: 📥 **Download** a detailed clinical report.
- **Check Another Image**: Resets the scanner for a new session.

---

## 📑 Understanding the PDF Report
The generated PDF is a **"Super Data Sheet"** designed for clinical review.

- **Status Header**: Clearly indicates the health status with color coding.
- **Cell Measurement Table**:
    - **Nucleus Size**: Measures the central genetic material area.
    - **Average Area**: Total surface area of identified cells.
    - **Roundness**: Differentiates between healthy (round) and cancerous (irregular) shapes.
    - **Density**: Shows how crowded the cells are in the sample.
- **Healthy Reference**: Shows the baseline values for the selected organ so you can see exactly where the sample deviates.

---

## 🛠 Troubleshooting & Tips

- **"Need a Picture" Error**: This happens if the uploaded image is not a cell slide. Ensure your photo is bright, in focus, and contains microscopic cellular textures.
- **Accuracy Sync**: If you want more accurate results for a specific patient type, use the **Train Scanner** feature with samples from their specific demographic.
- **PDF Alignment**: For the best PDF layout, ensure all metric fields are populated before clicking "Save".

---

## 🏁 Windows Specific Tips

### Camera Access on Windows 10/11
If the camera fails to initialize even after granting browser permission:
1. Open **Windows Settings**.
2. Go to **Privacy & Security** > **Camera**.
3. Ensure **"Camera access"** is ON and **"Let apps access your camera"** is ON.

### Virtual Environments
On Windows, if you get an execution policy error when activating your environment:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

**Disclaimer**: This platform is an AI-assisted diagnostic tool. Results must always be verified by a certified medical professional.
