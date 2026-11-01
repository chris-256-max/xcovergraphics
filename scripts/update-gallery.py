
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent.parent

GALLERY = ROOT / "assets" / "images" / "gallery"
OUTPUT = ROOT / "js" / "projects.js"

SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

def natural_key(value):
    return [
        int(part) if part.isdigit() else part.lower()
        for part in re.split(r"(\d+)", str(value))
    ]

projects = []

for image in sorted(
    GALLERY.rglob("*"),
    key=lambda p: natural_key(p.relative_to(GALLERY))
):
    if not image.is_file():
        continue

    if image.suffix.lower() not in SUPPORTED:
        continue

    relative = image.relative_to(GALLERY)

    category = (
        relative.parts[0]
        if len(relative.parts) > 1
        else "Other"
    )

    title = image.stem.replace("_", " ").replace("-", " ").strip()

    projects.append({
        "title": title,
        "category": category,
        "image": "../assets/images/gallery/" + relative.as_posix()
    })

OUTPUT.parent.mkdir(parents=True, exist_ok=True)

OUTPUT.write_text(
    "window.XCOVER_PROJECTS = " +
    json.dumps(projects, indent=2, ensure_ascii=False) +
    ";\n",
    encoding="utf-8"
)

print(f"Gallery updated successfully: {len(projects)} projects.")
