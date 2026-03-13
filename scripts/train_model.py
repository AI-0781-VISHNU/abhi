import os
import json
import numpy as np
import cv2
from analyze_image import extract_features

def train_on_directory(directory):
    all_metrics = []
    if not os.path.exists(directory):
        print(f"Warning: Directory {directory} not found.")
        return None
        
    files = [f for f in os.listdir(directory) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not files:
        print(f"Warning: No images found in {directory}.")
        return None

    for filename in files:
        path = os.path.join(directory, filename)
        img = cv2.imread(path)
        if img is not None:
            # Resize for consistency (same as analyze_image)
            height, width = img.shape[:2]
            if width > 1000:
                scale = 1000 / width
                img = cv2.resize(img, (1000, int(height * scale)))
            
            features = extract_features(img)
            if features:
                all_metrics.append(features)
                print(f"    - Processed {filename}: Darkness={features['darkness']:.3f}, Circ={features['circularity']:.3f}")
                    
    if not all_metrics:
        return None
        
    return {
        "darkness": float(np.mean([m["darkness"] for m in all_metrics])),
        "circularity": float(np.mean([m["circularity"] for m in all_metrics])),
        "avgArea": float(np.mean([m["avgArea"] for m in all_metrics])),
        "sampleCount": len(all_metrics)
    }

def run_training():
    base_test_dir = "public/test_images"
    organs = ["Skin", "Liver", "Kidney", "Breast", "Colon", "Lung"]
    
    model_weights = {}
    
    print("============================================================")
    print("      OPENCV DIAGNOSTIC MODEL CALIBRATION (LEARNING)        ")
    print("============================================================")
    
    cancer_dir = os.path.join(base_test_dir, "cancer_symptoms")
    healthy_dir = os.path.join(base_test_dir, "no_cancer_symptoms")
    
    print(f"Training on Cancer Dataset: {cancer_dir}")
    cancer_metrics = train_on_directory(cancer_dir)
    
    print(f"\nTraining on Healthy Dataset: {healthy_dir}")
    healthy_metrics = train_on_directory(healthy_dir)
    
    if cancer_metrics and healthy_metrics:
        # For this simulation, we apply the learned global centroids to every organ
        # In a more advanced version, we would have organ-specific images in subfolders
        for organ in organs:
            model_weights[organ] = {
                "cancer": cancer_metrics,
                "healthy": healthy_metrics
            }
        
        # Save to JSON
        weights_path = os.path.join(os.path.dirname(__file__), "model_weights.json")
        with open(weights_path, 'w') as f:
            json.dump(model_weights, f, indent=4)
        
        print("\n" + "="*60)
        print("CALIBRATION SUCCESSFUL")
        print(f"Weights saved to: {weights_path}")
        print(f"Trained on {cancer_metrics['sampleCount']} Cancer & {healthy_metrics['sampleCount']} Healthy samples.")
        print("="*60)
    else:
        print("\nERROR: Training failed. Insufficient data.")

if __name__ == "__main__":
    run_training()
