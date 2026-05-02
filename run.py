"""
run.py — One-click setup and launch for the FraudChurn Nexus Platform.

This script:
1. Creates a local Python virtual environment (.venv) if it doesn't exist.
2. Installs Python dependencies into the local .venv.
3. Installs Frontend (npm) dependencies if they are missing.
4. Launches both the FastAPI backend and React frontend.

Usage:
    python run.py
"""
import os
import sys
import subprocess
import platform
import time
import signal

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
VENV_DIR = os.path.join(BASE_DIR, ".venv")
IS_WINDOWS = platform.system() == "Windows"

# Python executable inside the venv
if IS_WINDOWS:
    VENV_PYTHON = os.path.join(VENV_DIR, "Scripts", "python.exe")
    NPM = "npm.cmd"
else:
    VENV_PYTHON = os.path.join(VENV_DIR, "bin", "python")
    NPM = "npm"

processes = []

def run_command(command, cwd=None, env=None):
    """Utility to run a command and wait for it to complete."""
    print(f"Executing: {' '.join(command)}")
    try:
        subprocess.check_call(command, cwd=cwd, env=env)
    except subprocess.CalledProcessError as e:
        print(f"Error: Command failed with exit code {e.returncode}")
        sys.exit(e.returncode)

def setup_venv():
    """Create and prepare the Python virtual environment."""
    if not os.path.exists(VENV_DIR):
        print(f"\n[1/3] Creating virtual environment in {VENV_DIR}...")
        subprocess.check_call([sys.executable, "-m", "venv", VENV_DIR])
    else:
        print("\n[1/3] Virtual environment already exists.")

    print("[2/3] Installing/Updating Python dependencies...")
    run_command([VENV_PYTHON, "-m", "pip", "install", "--upgrade", "pip"])
    run_command([VENV_PYTHON, "-m", "pip", "install", "-r", "requirements.txt"], cwd=BASE_DIR)

def setup_frontend():
    """Install frontend dependencies if node_modules is missing."""
    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules):
        print("\n[3/3] Installing frontend dependencies (npm install)... This may take a minute.")
        run_command([NPM, "install"], cwd=FRONTEND_DIR)
    else:
        print("\n[3/3] Frontend dependencies already installed.")

def start_services():
    """Launch backend and frontend processes."""
    print("\n" + "="*60)
    print("  LAUNCHING SERVICES")
    print("="*60)

    # Start Backend
    print("[Backend] Starting FastAPI on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [VENV_PYTHON, "-m", "uvicorn", "backend.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
        cwd=BASE_DIR
    )
    processes.append(backend_proc)

    time.sleep(2)  # Wait for backend to warm up

    # Start Frontend
    print("[Frontend] Starting React (Vite) on http://localhost:5173 ...")
    frontend_proc = subprocess.Popen(
        [NPM, "run", "dev"],
        cwd=FRONTEND_DIR,
        shell=IS_WINDOWS
    )
    processes.append(frontend_proc)

    return backend_proc, frontend_proc

def shutdown(sig=None, frame=None):
    """Gracefully stop all processes."""
    print("\n\n[System] Shutting down services...")
    for proc in processes:
        try:
            if IS_WINDOWS:
                # On Windows, terminate() often leaves children running, so we kill the tree
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(proc.pid)])
            else:
                proc.terminate()
        except Exception:
            pass
    print("[System] All services stopped. Goodbye!")
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handlers for clean exit
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        # Step 1: Python Environment
        setup_venv()

        # Step 2: Frontend Environment
        setup_frontend()

        # Step 3: Run
        backend, frontend = start_services()

        print("\n" + "*" * 60)
        print("  FRAUDCHURN NEXUS PLATFORM IS LIVE!")
        print("  - Local Dashboard: http://localhost:5173")
        print("  - API Explorer:    http://localhost:8000/docs")
        print("  - Press Ctrl+C to stop.")
        print("*" * 60 + "\n")

        # Keep the script running and monitor processes
        while True:
            if backend.poll() is not None:
                print("[Backend] Process exited. Shutting down...")
                break
            if frontend.poll() is not None:
                print("[Frontend] Process exited. Shutting down...")
                break
            time.sleep(2)

    except KeyboardInterrupt:
        shutdown()
    except Exception as e:
        print(f"\n[Error] An unexpected error occurred: {e}")
        shutdown()
