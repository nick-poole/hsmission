#!/usr/bin/env python3
"""Sync every <img> tag's width/height attributes with the intrinsic
dimensions of the file on disk (CLS guard, brief §9). Pure stdlib.

Run from the repo root after any image is added, replaced, or resized:
    python3 scripts/update-image-dimensions.py
"""
import glob, os, re, struct, sys

def png_size(f):
    f.seek(16)
    return struct.unpack(">II", f.read(8))

def jpeg_size(f):
    f.seek(2)
    while True:
        b = f.read(2)
        if len(b) < 2:
            return None
        marker, = struct.unpack(">H", b)
        if marker == 0xFFD9:
            return None
        seg_len, = struct.unpack(">H", f.read(2))
        if 0xFFC0 <= marker <= 0xFFCF and marker not in (0xFFC4, 0xFFC8, 0xFFCC):
            f.read(1)
            h, w = struct.unpack(">HH", f.read(4))
            return (w, h)
        f.seek(seg_len - 2, 1)

def webp_size(f):
    f.seek(12)
    fmt = f.read(4)
    if fmt == b"VP8 ":
        f.seek(26)
        w, h = struct.unpack("<HH", f.read(4))
        return (w & 0x3FFF, h & 0x3FFF)
    if fmt == b"VP8L":
        f.seek(21)
        b = f.read(4)
        w = 1 + (((b[1] & 0x3F) << 8) | b[0])
        h = 1 + (((b[3] & 0xF) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
        return (w, h)
    if fmt == b"VP8X":
        f.seek(24)
        b = f.read(6)
        return (1 + (b[0] | (b[1] << 8) | (b[2] << 16)),
                1 + (b[3] | (b[4] << 8) | (b[5] << 16)))
    return None

def size(path):
    with open(path, "rb") as f:
        head = f.read(12)
        f.seek(0)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            return png_size(f)
        if head[:2] == b"\xff\xd8":
            return jpeg_size(f)
        if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
            return webp_size(f)
    return None

changed = 0
for page in glob.glob("**/*.html", recursive=True):
    if "node_modules" in page:
        continue
    html = open(page, encoding="utf-8").read()

    def fix(m):
        global changed
        tag = m.group(0)
        src_m = re.search(r'src="([^"]+)"', tag)
        if not src_m:
            return tag
        src = src_m.group(1).lstrip("/")
        if src.startswith("http") or src.endswith(".svg") or not os.path.exists(src):
            return tag
        d = size(src)
        if not d:
            return tag
        w, h = str(d[0]), str(d[1])
        new = tag
        if 'width="' in new:
            new = re.sub(r'width="\d+"', f'width="{w}"', new)
            new = re.sub(r'height="\d+"', f'height="{h}"', new)
        else:
            new = new.replace(src_m.group(0), f'{src_m.group(0)} width="{w}" height="{h}"')
        if new != tag:
            changed += 1
        return new

    new_html = re.sub(r"<img\b[^>]*/?>", fix, html)
    if new_html != html:
        open(page, "w", encoding="utf-8").write(new_html)

print(f"updated {changed} img tag(s)")
