# CellSight AI: AI-Powered Histology Diagnostics

An advanced, data-driven medical platform for the Digital Image-Based Comparison of Normal and Cancer Cells across different human organs. This system utilizes a hybrid approach combining **Next.js**, **OpenCV**, and **Python-based Image Analysis** to provide real-time diagnostic reports with professional PDF export capabilities.

---

## Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v20 or higher (Download from [nodejs.org](https://nodejs.org/))
- **Python**: v3.10+ (Ensure "Add to PATH" is checked during installation)
- **Git**: For cloning the repository
- **Docker Desktop**: Required for containerized deployment on Windows.
- **Database**: PostgreSQL (Local/Docker) or SQLite (for dev)

### 2. General Setup

#### **Windows (PowerShell/CMD)**:
```powershell
# Clone and install Node dependencies
npm install

# Setup Python Virtual Environment (Recommended)
python -m venv venv

# TIP: If you get a "Script execution is disabled" error, run: 
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Initial database setup
npx prisma db push
npx prisma db seed
```

#### **Linux/macOS**:
```bash
# Clone and install Node dependencies
npm install

# Setup Python Virtual Environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip3 install -r requirements.txt

# Initial database setup
npx prisma db push
npx prisma db seed
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the platform.

---

## Docker Setup (Windows)

To run this project on Windows using Docker, follow these steps:

### 1. Install Docker Desktop
1. Download **Docker Desktop for Windows** from [docker.com](https://www.docker.com/products/docker-desktop/).
2. Run the installer and ensure **"Use WSL 2 instead of Hyper-V"** is checked.
3. Restart your computer if prompted.

### 2. Configure WSL 2
1. Open PowerShell as Administrator and run:
   ```powershell
   wsl --install
   ```
2. Ensure you have a Linux distribution installed (e.g., Ubuntu from Microsoft Store).
3. In Docker Desktop Settings, go to **Resources > WSL Integration** and enable it for your installed distribution.

### 3. Running with PowerShell
Open a PowerShell terminal in the project directory and run:

```powershell
# Build and Start the application
docker compose up -d --build

# Check if containers are running
docker ps

# View Real-time Logs
docker compose logs -f
```

---

## Mobile Development (Android)

To run the application on an Android device or emulator:

### 1. Windows Environment Variables (First Time Only)
If you are on Windows, you must configure your Android SDK paths:
1.  Search for **"Edit the system environment variables"** in your Start menu.
2.  Click **Environment Variables**.
3.  Under **User variables**, click **New** and add:
    *   **Variable name:** `ANDROID_HOME`
    *   **Variable value:** `%LOCALAPPDATA%\Android\Sdk`
4.  Find the `Path` variable, click **Edit**, and add these two new lines:
    *   `%ANDROID_HOME%\platform-tools`
    *   `%ANDROID_HOME%\emulator`
5.  **Restart your terminal** for changes to take effect.

### 2. Linux KVM Setup (For Emulator)
If you are on Linux and want to use the Android Emulator, ensure Hardware Acceleration is enabled:
1.  Install KVM checker: `sudo apt install cpu-checker`
2.  Run `kvm-ok`. If it says "KVM acceleration can be used", you are good.
3.  If not, enable **Virtualization (VT-x/AMD-V)** in your BIOS.
4.  Add your user to the KVM group:
    ```bash
    sudo adduser $USER kvm
    sudo chown $USER /dev/kvm
    ```
5.  **Restart your computer**.

### 3. Change IP for Network Changes
If your network changes (e.g., switching Wi-Fi), you must update the server URL so the mobile app can reach your local machine:
1. Open [**capacitor.config.ts**](./capacitor.config.ts).
2. Update the `url` field under `server` with your current local IP address:
   ```typescript
   server: {
     url: 'http://YOUR_NEW_IP:3000',
     cleartext: true
   }
   ```
   *   **Linux**: Run `hostname -I` to find your IP.
   *   **Windows**: Run `ipconfig` in PowerShell/CMD and look for `IPv4 Address`.

### 3. Run the Development Server
Ensure your local server is running:
```bash
npm run dev
```

### 4. Open in Android Studio
To open the Android project and run it on a device:
```bash
npm run cap:open:android
```
Once Android Studio opens, click the **"Run"** button (green play icon) to launch the app on your connected device or emulator.

---


## Documentation

For more detailed information, please refer to:
- [**User Guide**](./USER_GUIDE.md): Page-by-page instructions and button usage.
- [**Technical Specifications**](./PROJECT_SPECIFICATIONS.txt): Deep dive into algorithms and tools.
**Access**: [http://localhost:3001](http://localhost:3001)

---

## Training the Diagnostic Engine

The platform features a custom-built diagnostic engine that learns from your provided histology samples.

### How to Train:
1. Navigate to the **Health Scanner** page.
2. Select an **Organ** (e.g., Skin, Lung, Breast).
3. Upload a folder/set of **Cancer Samples** (H&E stained slides).
4. Upload a folder/set of **Healthy Samples**.
5. Click **"Train Scanner"**.

### Manual CLI Training (Background):
If you want to train via command line:
```bash
python3 scripts/train_model.py
```
This updates the `scripts/model_weights.json` used by the analysis engine.

---

## Image Analysis Workflow

Once trained, the system performs a multi-step check on every uploaded image:

1. **Validation ("Need a Picture")**: The system detects if the input is a valid histology slide. If it is too dark, blurry, or not an H&E stain, it returns a "Need a Picture" warning.
2. **Feature Extraction**: OpenCV extracts metrics like:
   - Average Cell Area
   - Nuclear/Cytoplasmic Ratio
   - Circularity (Cell Roundness)
   - Cell Density
3. **Diagnostic Comparison**: The extracted metrics are compared against the **trained data centroids** for the selected organ.
4. **Report Generation**: A professional report is generated, which can be exported as a PDF "Super Data Sheet".

---

## Key PDF Features
The downloaded diagnostic reports include:
- **Scan ID & Timestamp** for traceability.
- **Color-coded Status** (Emerald for Healthy, Rose for Cancer).
- **Comparative Data Table**: Shows exactly how your uploaded sample deviates from healthy averages.
- **Clinical Recommendations** based on AI findings.

---

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes, Python 3 (Subprocess Bridge).
- **Computer Vision**: OpenCV, NumPy.
- **Database**: PostgreSQL with Prisma ORM.
- **Reporting**: jsPDF, jsPDF-AutoTable.
- **Containerization**: Docker & Docker Compose.
