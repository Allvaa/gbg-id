import keras

_model = None

def load_model():
    global _model
    if _model is None:
        _model = keras.models.load_model("model.keras")
    return _model
