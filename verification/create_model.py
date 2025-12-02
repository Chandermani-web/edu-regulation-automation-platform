import tensorflow as tf
import os  # <--- Added missing import
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D

# Define the folder where this script is running
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Define your specific categories
# These MUST match the list in your verification script
CLASSES = ["Classroom", "Laboratory", "Library", "College Building", "Other"]

print("⏳ Downloading base model (MobileNetV2)...")

# 2. Download a pre-trained base model (MobileNetV2 is fast and lightweight)
# We use 'imagenet' weights so it already knows how to see shapes/edges
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# 3. Add your custom layers on top
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)  # Intermediate layer
predictions = Dense(len(CLASSES), activation='softmax')(x)  # Output layer for your 5 classes

# 4. Create the final model
model = Model(inputs=base_model.input, outputs=predictions)

# 5. Compile it (Required before saving)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 6. Save as .h5 file in the SAME directory
filename = "university_model.h5"
save_path = os.path.join(BASE_DIR, filename)

model.save(save_path)

print(f"\n✅ SUCCESS! Model saved at:")
print(f"📂 {save_path}")
print("👉 You can now run your main verification script (smart.py).")