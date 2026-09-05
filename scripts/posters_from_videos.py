"""Rebuild every video-backed poster from the video's final frame (composition complete), keyed
with remove_media_bg.cut so it floats on the dark site. Walks content/*.json for any object that
pairs an image path with a video path. Originals are backed up to media-originals/."""
import glob, json, os, subprocess, sys
import cv2, numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from remove_media_bg import cut, backup, PUBLIC, ROOT  # noqa: E402

IMG_KEYS = ("src", "art", "image")
VID_KEYS = ("videoMp4", "video", "artVideoMp4", "artVideo")


def pairs(node, out):
    if isinstance(node, dict):
        img = next((node[k] for k in IMG_KEYS if isinstance(node.get(k), str) and node[k].endswith(".webp")), None)
        vid = next((node[k] for k in VID_KEYS if isinstance(node.get(k), str)), None)
        if img and vid:
            out[img] = vid
        for v in node.values():
            pairs(v, out)
    elif isinstance(node, list):
        for v in node:
            pairs(v, out)


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return None


def last_frame(path):
    d = duration(path)
    # decode a short tail and keep the final frame; avoids seeking past EOF on VFR files
    start = max(0.0, (d or 10) - 0.6)
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{start:.2f}", "-i", path, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
        capture_output=True,
    )
    p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", path], capture_output=True, text=True)
    w, h = map(int, p.stdout.strip().split(","))
    n = len(r.stdout) // (w * h * 3)
    if n == 0:
        return None
    return np.frombuffer(r.stdout[(n - 1) * w * h * 3 : n * w * h * 3], dtype=np.uint8).reshape(h, w, 3)


found = {}
for f in glob.glob(os.path.join(ROOT, "content", "*.json")):
    pairs(json.load(open(f)), found)

for img, vid in sorted(found.items()):
    ip = os.path.join(PUBLIC, img.lstrip("/"))
    vp = os.path.join(PUBLIC, vid.lstrip("/"))
    if not os.path.exists(vp):
        alt = os.path.splitext(vp)[0] + (".webm" if vp.endswith(".mp4") else ".mp4")
        vp = alt if os.path.exists(alt) else None
    if not vp or not os.path.exists(ip):
        print("skip", img, vid); continue
    frame = last_frame(vp)
    if frame is None:
        print("no frame", vid); continue
    backup(ip)
    out = cut(frame)
    cv2.imwrite(ip, out, [cv2.IMWRITE_WEBP_QUALITY, 92])
    print(f"poster {img} <- {os.path.basename(vp)} {frame.shape[1]}x{frame.shape[0]} transparent={100*(out[:,:,3]<10).mean():.0f}%")
print("DONE")
