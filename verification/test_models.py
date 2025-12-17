"""Quick test to verify model paths are correct"""
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, "model")

# Model paths
DEFAULT_CLASSROOM_MODEL = os.path.join(MODEL_DIR, "classroom_classification.pt")
DEFAULT_LIBRARY_MODEL = os.path.join(MODEL_DIR, "library_classification.pt")
DEFAULT_LAB_MODEL = os.path.join(MODEL_DIR, "laboratory_detection.pt")

print("Testing model paths...")
print(f"\n📂 Script directory: {SCRIPT_DIR}")
print(f"📂 Model directory: {MODEL_DIR}")

print(f"\n✅ Classroom model exists: {os.path.exists(DEFAULT_CLASSROOM_MODEL)}")
print(f"   Path: {DEFAULT_CLASSROOM_MODEL}")

print(f"\n✅ Library model exists: {os.path.exists(DEFAULT_LIBRARY_MODEL)}")
print(f"   Path: {DEFAULT_LIBRARY_MODEL}")

print(f"\n⚠️  Lab model exists: {os.path.exists(DEFAULT_LAB_MODEL)}")
print(f"   Path: {DEFAULT_LAB_MODEL}")

if os.path.exists(DEFAULT_CLASSROOM_MODEL) and os.path.exists(DEFAULT_LIBRARY_MODEL):
    print("\n✅ All required models found!")
else:
    print("\n❌ Missing required models!")
