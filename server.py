from flask import Flask, request, jsonify
from PIL import Image
from model import load_model, predict_image

model = load_model()

app = Flask(
    __name__,
    static_folder="static",
    static_url_path=""
    )

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if not request.content_type.startswith("multipart/form-data"):
        return jsonify({"error": "Invalid content-type"}), 400
    
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    img = Image.open(request.files["image"]).convert("RGB")
    result = predict_image(model, img)
    return jsonify(result)

if __name__ == "__main__":
    app.run()
