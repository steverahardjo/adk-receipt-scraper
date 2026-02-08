"""
Receipt Dataset Synthesis Module

This module creates synthetic receipt detection datasets by combining real receipt images
with natural background imagery. It applies realistic augmentations to generate diverse
training samples for YOLO-based receipt detection models.

The workflow:
1. Downloads receipt and background images from Kaggle
2. Applies realistic augmentations (folding, shadows, blur, brightness variations)
3. Randomly scales and rotates receipts to simulate different capture angles
4. Overlays processed receipts onto background images
5. Generates YOLO-format labels with normalized bounding box coordinates

Data Sources:
- Receipt images: dhiaznaidi/receiptdatasetssd300v2 (MSIA version)
- Background images: nguyenquocdungk16hl/bg-20o

Output Dataset:
- Large number of synthetic receipt images with corresponding YOLO labels
- Ready for training, validation, and testing splits (typically 70-10-10)
- Each image has a corresponding .txt label file with bounding box annotations
"""

import kagglehub
import os
import cv2
import random
import numpy as np
from augraphy import *

receipt_path = kagglehub.dataset_download("dhiaznaidi/receiptdatasetssd300v2")
bg_path = kagglehub.dataset_download("nguyenquocdungk16hl/bg-20o")

# Augmentation effects are initialized once and reused for efficiency
# These simulate real-world camera capture conditions and document handling
folding = Folding(fold_count=3, fold_noise=0.1, backdrop_color=(0, 0, 0))
shadowcast = ShadowCast(
    shadow_opacity_range=(0.4, 0.5),
    shadow_blur_kernel_range=(51, 151),
)
dirty_rollers = DirtyRollers(line_width_range=(12, 25), scanline_type=0)
brightness = Brightness(brightness_range=(0.8, 1.2))


def get_image_files(directory, exts=(".jpg", ".jpeg", ".png")):
    """
    Recursively find all image files in a directory.
    
    Args:
        directory: Root directory to search
        exts: Tuple of file extensions to match (case-insensitive)
    
    Returns:
        List of full paths to image files
    """
    return [
        os.path.join(root, f)
        for root, _, files in os.walk(directory)
        for f in files
        if f.lower().endswith(exts)
    ]


def overlay_with_alpha(bg, fg, x, y):
    """
    Blend a foreground image onto a background using alpha channel transparency.
    Handles both RGBA images (with transparency) and standard RGB images.
    
    Args:
        bg: Background image (must be RGB or BGR)
        fg: Foreground image (can be grayscale, RGB, or RGBA)
        x, y: Top-left coordinates for placement on background
    
    Returns:
        Background image with foreground blended in
    """
    if fg.ndim == 2:
        fg = fg[:, :, None]

    h, w = fg.shape[:2]
    c = fg.shape[2]

    if c == 4:  # RGBA
        alpha = fg[:, :, 3] / 255.0
        for i in range(3):
            bg[y:y+h, x:x+w, i] = (
                alpha * fg[:, :, i]
                + (1 - alpha) * bg[y:y+h, x:x+w, i]
            )
    else:
        bg[y:y+h, x:x+w, :3] = fg[:, :, :3]

    return bg


def synthetize_data(rec_dir, bg_dir, out_dir, n_pairs=2000, variations_per_pair=2):
    """
    Generate synthetic receipt detection dataset by compositing receipts onto backgrounds.
    
    This function creates diverse training samples by:
    1. Randomly pairing receipt and background images
    2. Applying augmentations (folding, brightness adjustment)
    3. Scaling receipts to 40-80% of background size
    4. Rotating receipts by -15 to +15 degrees
    5. Overlaying onto random positions
    6. Adding shadow and scanner effects
    7. Generating YOLO format labels with normalized bounding boxes
    
    Args:
        rec_dir: Directory containing receipt images
        bg_dir: Directory containing background images
        out_dir: Output directory (will create images/, labels/, receipts_clean/ subdirs)
        n_pairs: Number of receipt-background pairs to create (default: 2000)
        variations_per_pair: Number of variations per pair (default: 2)
    
    Output Structure:
        out_dir/
        ├── images/          : Generated composite images (JPG)
        ├── labels/          : YOLO format annotations (TXT)
        └── receipts_clean/  : Processed receipts before overlay (PNG)
    """
    img_out = os.path.join(out_dir, "images")
    lbl_out = os.path.join(out_dir, "labels")
    clean_out = os.path.join(out_dir, "receipts_clean")

    os.makedirs(img_out, exist_ok=True)
    os.makedirs(lbl_out, exist_ok=True)
    os.makedirs(clean_out, exist_ok=True)

    rec_files = get_image_files(rec_dir)
    bg_files = get_image_files(bg_dir)

    idx = 0

    for _ in range(n_pairs):
        rec_path = random.choice(rec_files)
        bg_path = random.choice(bg_files)

        rec_orig = cv2.imread(rec_path, cv2.IMREAD_UNCHANGED)
        bg_orig = cv2.imread(bg_path)

        if rec_orig is None or bg_orig is None:
            continue

        for _ in range(variations_per_pair):
            rec = rec_orig.copy()
            canvas = bg_orig.copy()

            # Randomly apply folding effect to simulate wrinkled receipt
            if random.random() > 0.5:
                rec = folding(rec)

            # Adjust brightness to match different lighting conditions
            rec = brightness(rec)

            # Scale
            bg_h, bg_w = bg_orig.shape[:2]
            scale = min(
                bg_w / rec.shape[1],
                bg_h / rec.shape[0],
            ) * random.uniform(0.4, 0.8)

            rec = cv2.resize(
                rec, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA
            )

            # Rotate
            rh, rw = rec.shape[:2]
            angle = random.uniform(-15, 15)
            M = cv2.getRotationMatrix2D((rw / 2, rh / 2), angle, 1.0)

            rec = cv2.warpAffine(
                rec,
                M,
                (rw, rh),
                borderMode=cv2.BORDER_CONSTANT,
                borderValue=(0, 0, 0, 0),
            )

            # -----------------------
            # Save cleaned receipt
            # -----------------------
            clean_name = f"receipt_{idx:06d}.png"
            cv2.imwrite(os.path.join(clean_out, clean_name), rec)

            # -----------------------
            # Placement
            # -----------------------
            rh, rw = rec.shape[:2]
            x = random.randint(0, bg_w - rw)
            y = random.randint(0, bg_h - rh)

            canvas = overlay_with_alpha(canvas, rec, x, y)

            # -----------------------
            # Global effects
            # -----------------------
            if random.random() > 0.4:
                canvas = shadowcast(canvas)

            if random.random() > 0.9:
                canvas = dirty_rollers(canvas)

            # -----------------------
            # YOLO label
            # -----------------------
            x_center = (x + rw / 2) / bg_w
            y_center = (y + rh / 2) / bg_h
            w_norm = rw / bg_w
            h_norm = rh / bg_h

            label = f"0 {x_center:.6f} {y_center:.6f} {w_norm:.6f} {h_norm:.6f}\n"

            img_name = f"{idx:06d}.jpg"
            lbl_name = f"{idx:06d}.txt"

            cv2.imwrite(os.path.join(img_out, img_name), canvas)
            with open(os.path.join(lbl_out, lbl_name), "w") as f:
                f.write(label)

            idx += 1

    print(f"Done. Generated {idx} images.")


synthetize_data(
    rec_dir=receipt_path,
    bg_dir=bg_path,
    out_dir="data",
)






