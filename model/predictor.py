from keras import Model
from keras.applications.resnet50 import preprocess_input
import numpy as np

IMG_SIZE = 256

CLASSES = [
    'battery',
    'biological',
    'cardboard',
    'clothes',
    'glass',
    'metal',
    'paper',
    'plastic',
    'shoes',
    'trash'
]

CLASS_META = {
    'battery':    {'type': 'anorganik', 'recyclable': False},
    'biological': {'type': 'organik',   'recyclable': False},
    'cardboard':  {'type': 'anorganik', 'recyclable': True},
    'clothes':    {'type': 'anorganik', 'recyclable': True},
    'glass':      {'type': 'anorganik', 'recyclable': True},
    'metal':      {'type': 'anorganik', 'recyclable': True},
    'paper':      {'type': 'anorganik', 'recyclable': True},
    'plastic':    {'type': 'anorganik', 'recyclable': True},
    'shoes':      {'type': 'anorganik', 'recyclable': False},
    'trash':      {'type': 'anorganik', 'recyclable': False}
}

def predict_image(model: Model, img):
    img = img.convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img = np.array(img).astype(np.float32)
    img = np.expand_dims(img, axis=0)
    x = preprocess_input(img)

    pred = model.predict(x)
    class_id = int(np.argmax(pred))
    confidence = float(np.max(pred))

    class_name = CLASSES[class_id]
    meta = CLASS_META.get(class_name, {})

    return {
        "class_id": class_id,
        "class_name": class_name,
        "type": meta.get("type"),
        "recyclable": meta.get("recyclable"),
        "confidence": confidence
    }
