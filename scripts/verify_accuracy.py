import os
import json
import subprocess
import sys

def run_analysis(image_path):
    try:
        result = subprocess.run(
            [sys.executable, "scripts/analyze_image.py", image_path],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except Exception as e:
        return {"error": str(e)}

def verify_accuracy():
    base_dir = "public/test_images"
    categories = {
        "cancer_symptoms": "Cancer Detected",
        "no_cancer_symptoms": "No Cancer Found"
    }

    stats = {
        "TP": 0, "TN": 0, "FP": 0, "FN": 0,
        "total": 0, "errors": 0
    }
    
    failures = []

    print(f"{'='*60}")
    print(f"{'IMAGE NAME':<40} | {'PREDICTION':<20} | {'STATUS'}")
    print(f"{'-'*60}")

    for folder, expected in categories.items():
        folder_path = os.path.join(base_dir, folder)
        if not os.path.exists(folder_path):
            print(f"Warning: Folder {folder_path} not found.")
            continue

        for filename in os.listdir(folder_path):
            if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue

            img_path = os.path.join(folder_path, filename)
            result = run_analysis(img_path)
            
            if "error" in result:
                print(f"{filename:<40} | ERROR: {result['error']}")
                stats["errors"] += 1
                continue

            prediction = result.get("metrics", {}).get("prediction", "Unknown")
            stats["total"] += 1
            
            is_correct = (prediction == expected)
            match_status = "PASS" if is_correct else "FAIL"

            metrics = result.get("metrics", {})
            print(f"{filename:<40} | {prediction:<20} | {match_status} (Area: {metrics.get('avgArea')}, Circ: {metrics.get('circularity')}, Pleo: {metrics.get('pleomorphism')}, Dark: {metrics.get('darkness')})")

            if expected == "Cancer Detected":
                if prediction == "Cancer Detected": stats["TP"] += 1
                else: 
                    stats["FN"] += 1
                    failures.append({"file": filename, "expected": expected, "result": result})
            else:
                if prediction == "No Cancer Found": stats["TN"] += 1
                else: 
                    stats["FP"] += 1
                    failures.append({"file": filename, "expected": expected, "result": result})

    print(f"{'='*60}")
    print("\nSUMMARY STATISTICS:")
    print(f"Total Processed: {stats['total']}")
    print(f"True Positives (TP):  {stats['TP']}")
    print(f"True Negatives (TN):  {stats['TN']}")
    print(f"False Positives (FP): {stats['FP']} (Healthy flagged as Cancer)")
    print(f"False Negatives (FN): {stats['FN']} (Cancer missed)")
    
    if stats['total'] > 0:
        accuracy = (stats['TP'] + stats['TN']) / stats['total'] * 100
        print(f"Overall Accuracy:   {accuracy:.2f}%")
    
    if failures:
        print("\nFAILURE ANALYSIS (Detailed Metrics):")
        for fail in failures:
            metrics = fail['result'].get('metrics', {})
            print(f"- {fail['file']}: Expected {fail['expected']}")
            print(f"  Metrics: Area={metrics.get('avgArea')}, Circ={metrics.get('circularity')}, Pleo={metrics.get('pleomorphism')}")

if __name__ == "__main__":
    verify_accuracy()
