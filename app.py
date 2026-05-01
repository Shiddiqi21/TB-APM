"""
SampahPedia Backend — Flask + TensorFlow/Keras
Serves CNN model (MobileNetV2) for waste classification.
"""

import os
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import io

# ===== CONFIG =====
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.h5')

# Urutan kelas sesuai alfabet folder dataset Kaggle (carton, metal, plastico, vidrio)
CLASS_NAMES = ['kardus', 'logam', 'plastik', 'kaca']

IMG_SIZE = (224, 224)
PORT = 5000

# ===== APP SETUP =====
app = Flask(__name__, static_folder='frontend', static_url_path='')

# ===== LOAD MODEL =====
print("\n[SampahPedia] Memuat Model CNN...")
import tensorflow as tf

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

model = tf.keras.models.load_model(MODEL_PATH)
print("[OK] Model berhasil dimuat!")
print(f"   Input shape : {model.input_shape}")
print(f"   Output kelas: {len(CLASS_NAMES)} ({', '.join(CLASS_NAMES)})")
print()


# ===== STATIC FILE ROUTES =====
@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('frontend', path)


# ===== PREDICTION API =====
@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file yang diunggah'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nama file kosong'}), 400

    try:
        # Baca dan preprocessing gambar
        image = Image.open(io.BytesIO(file.read())).convert('RGB')
        image = image.resize(IMG_SIZE)

        img_array = np.array(image, dtype=np.float32)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)

        # Prediksi
        predictions = model.predict(img_array, verbose=0)
        class_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][class_idx]) * 100

        # Response
        return jsonify({
            'category': CLASS_NAMES[class_idx],
            'confidence': round(confidence, 1),
            'all_predictions': {
                name: round(float(pred) * 100, 1)
                for name, pred in zip(CLASS_NAMES, predictions[0])
            }
        })

    except Exception as e:
        print(f"[ERROR] Prediction error: {e}")
        return jsonify({'error': str(e)}), 500


# ===== RUN =====
if __name__ == '__main__':
    print(f"[START] Server berjalan di http://localhost:{PORT}")
    print(f"   Buka URL tersebut di browser Anda\n")
    app.run(debug=False, port=PORT, host='0.0.0.0')
