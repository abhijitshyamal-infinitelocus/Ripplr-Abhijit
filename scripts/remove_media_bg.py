"""Strip the near-white studio background from illustration videos/posters.

Only the light region connected to the frame border is removed, so white object
faces stay intact. Luminance in that region becomes alpha, which keeps drop
shadows as soft dark transparency. Outputs VP9-alpha .webm + HEVC-alpha .mov
(Safari) for videos and RGBA .webp for posters. Originals are copied to
media-originals/ before being overwritten.

Usage: python3 scripts/remove_media_bg.py [--jobs 3] [--max-width 1280] [--fps 30]
"""
import argparse, os, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import cv2, numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
BACKUP = os.path.join(ROOT, "media-originals")
SKIP_DIRS = ("culture/moments", "culture/people", "about/team", "about/investors")
SKIP_FILES = ("culture-hero-1", "culture-hero-2", "culture-hero-3", "map.webp")

LIGHT_MIN = 178      # luminance floor for a pixel to be flood-fillable (bg + soft shadow)
GRAD_MAX = 9.0       # local gradient above this is an object rim: flood fill stops there
SAT_MAX = 26         # max channel spread; keeps tinted object faces out of the fill
ALPHA_SPAN = 60.0    # how far below the local backdrop luminance a pixel must fall to be opaque
EDGE = 4             # px of frame edge treated as backdrop unconditionally
BG_BLUR = 141        # window (px) for estimating the backdrop's local luminance (it has soft gradients)
SHADOW_RGB = np.array([34, 22, 12], dtype=np.uint8)  # BGR: deep navy for shadow pixels


def cut(bgr: np.ndarray) -> np.ndarray:
    """BGR frame -> BGRA. Floods from the frame border through smooth, near-neutral, light
    pixels (the studio backdrop and its soft shadows). Object rims carry a gradient spike, so
    white/light object faces that merely touch the backdrop are not consumed."""
    h, w = bgr.shape[:2]
    lum = bgr.astype(np.float32) @ np.array([0.114, 0.587, 0.299], dtype=np.float32)
    blur = cv2.GaussianBlur(lum, (3, 3), 0)
    gx = cv2.Sobel(blur, cv2.CV_32F, 1, 0, ksize=3) / 8.0
    gy = cv2.Sobel(blur, cv2.CV_32F, 0, 1, ksize=3) / 8.0
    grad = cv2.magnitude(gx, gy)
    spread = bgr.max(axis=2).astype(np.int16) - bgr.min(axis=2).astype(np.int16)
    fillable = ((lum > LIGHT_MIN) & (grad < GRAD_MAX) & (spread < SAT_MAX)).astype(np.uint8)
    _, labels = cv2.connectedComponents(fillable, connectivity=4)
    # Seed from a ring inset by EDGE px: some exports carry a 1px dark frame line at the very edge.
    e = EDGE
    border = np.concatenate([labels[e], labels[-1 - e], labels[:, e], labels[:, -1 - e]])
    bg_ids = np.unique(border[border != 0])
    region = np.isin(labels, bg_ids)
    region[:e + 1] = region[-e - 1:] = True
    region[:, :e + 1] = region[:, -e - 1:] = True
    # Local backdrop luminance: normalised box blur of the region's brightest pixels. Alpha is the
    # drop below that estimate, so gradient backdrops vanish fully while shadows stay as partial alpha.
    m = region.astype(np.float32)
    bright = np.where(region, lum, 0).astype(np.float32)
    bg_est = cv2.blur(bright, (BG_BLUR, BG_BLUR)) / np.maximum(cv2.blur(m, (BG_BLUR, BG_BLUR)), 1e-3)
    ramp = np.clip((bg_est - lum - 2.0) * (255.0 / ALPHA_SPAN), 0, 255)
    # grow one pixel into the rim so anti-aliased edge pixels get partial alpha instead of a light halo
    rim = cv2.dilate(region.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & ~region
    alpha = np.full((h, w), 255, dtype=np.float32)
    alpha[region] = ramp[region]
    alpha[rim] = np.minimum(alpha[rim], np.clip(ramp[rim] + 90, 0, 255))
    alpha[:e + 1] = alpha[-e - 1:] = 0
    alpha[:, :e + 1] = alpha[:, -e - 1:] = 0
    out = np.dstack([bgr, alpha.astype(np.uint8)])
    out[region, :3] = SHADOW_RGB
    return out


def is_already_transparent(path: str) -> bool:
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None or im.ndim < 3 or im.shape[2] < 4:
        return False
    h, w = im.shape[:2]
    corners = [im[2, 2, 3], im[2, w - 3, 3], im[h - 3, 2, 3], im[h - 3, w - 3, 3]]
    return all(c < 20 for c in corners)


def backup(path: str):
    rel = os.path.relpath(path, PUBLIC)
    dst = os.path.join(BACKUP, rel)
    if not os.path.exists(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(path, dst)


def process_image(path: str):
    rel = os.path.relpath(path, PUBLIC)
    src = os.path.join(BACKUP, rel)
    if not os.path.exists(src):
        if is_already_transparent(path):
            return f"skip (transparent) {path}"
        src = path
    im = cv2.imread(src, cv2.IMREAD_COLOR)
    if im is None:
        return f"skip (unreadable) {path}"
    backup(path)
    out = cut(im)
    cv2.imwrite(path, out, [cv2.IMWRITE_WEBP_QUALITY, 92])
    return f"image {path}"


def probe(path: str):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True,
    )
    w, h, fr = r.stdout.strip().split(",")
    num, den = fr.split("/")
    return int(w), int(h), float(num) / float(den)


def process_video(src: str, out_base: str, max_width: int, fps: int):
    w, h, src_fps = probe(src)
    scale = min(1.0, max_width / w)
    ow, oh = int(round(w * scale / 2) * 2), int(round(h * scale / 2) * 2)
    fps = min(fps, int(round(src_fps)))
    dec = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={fps},scale={ow}:{oh}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
        stdout=subprocess.PIPE,
    )
    webm = out_base + ".webm"
    mov = out_base + ".mov"
    common_in = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{ow}x{oh}", "-r", str(fps), "-i", "-"]
    enc_webm = subprocess.Popen(
        common_in + ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "34", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-auto-alt-ref", "0", "-an", webm + ".tmp.webm"],
        stdin=subprocess.PIPE,
    )
    enc_mov = subprocess.Popen(
        common_in + ["-c:v", "hevc_videotoolbox", "-alpha_quality", "0.85", "-q:v", "60", "-tag:v", "hvc1", "-pix_fmt", "bgra", "-an", mov + ".tmp.mov"],
        stdin=subprocess.PIPE,
    )
    frame_bytes = ow * oh * 3
    frames = 0
    while True:
        buf = dec.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        bgr = np.frombuffer(buf, dtype=np.uint8).reshape(oh, ow, 3)
        rgba = cut(bgr)
        data = rgba.tobytes()
        enc_webm.stdin.write(data)
        enc_mov.stdin.write(data)
        frames += 1
    dec.stdout.close()
    enc_webm.stdin.close()
    enc_mov.stdin.close()
    dec.wait(); rc1 = enc_webm.wait(); rc2 = enc_mov.wait()
    if rc1 == 0:
        os.replace(webm + ".tmp.webm", webm)
    if rc2 == 0:
        os.replace(mov + ".tmp.mov", mov)
    return f"video {out_base} {ow}x{oh}@{fps} frames={frames} webm={rc1} mov={rc2}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jobs", type=int, default=3)
    ap.add_argument("--max-width", type=int, default=1280)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--only", default="", help="substring filter on paths")
    args = ap.parse_args()

    images, videos = [], {}
    for dirpath, _, files in os.walk(os.path.join(PUBLIC, "figma")):
        rel = os.path.relpath(dirpath, PUBLIC).replace(os.sep, "/")
        if any(s in rel for s in SKIP_DIRS):
            continue
        for f in files:
            if f.startswith(".") or any(s in f for s in SKIP_FILES):
                continue
            p = os.path.join(dirpath, f)
            if args.only and args.only not in p:
                continue
            base, ext = os.path.splitext(p)
            if ext == ".webp":
                images.append(p)
            elif ext in (".mp4", ".webm"):
                # prefer the h264 source for decoding quality
                if base not in videos or ext == ".mp4":
                    videos[base] = p

    for p in images:
        print(process_image(p), flush=True)

    def run(item):
        base, src = item
        backup(src)
        other = base + (".webm" if src.endswith(".mp4") else ".mp4")
        if os.path.exists(other):
            backup(other)
        try:
            return process_video(src, base, args.max_width, args.fps)
        except Exception as e:  # noqa: BLE001
            return f"FAILED {base}: {e}"

    with ThreadPoolExecutor(max_workers=args.jobs) as ex:
        for msg in ex.map(run, sorted(videos.items())):
            print(msg, flush=True)
    print("DONE")


if __name__ == "__main__":
    sys.exit(main())
