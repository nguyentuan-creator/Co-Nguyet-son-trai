#!/usr/bin/env python3
"""Local server for the Co Chan Nhan roleplay game.

Serves the static UI and proxies chat requests to the Gemini API so the
API key never reaches the browser. Python standard library only.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"
PROMPT_FILE = ROOT / "prompts" / "system_prompt.md"


def load_env():
    values = {}
    env_file = ROOT / ".env"
    if not env_file.exists():
        return values
    for raw in env_file.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


ENV = load_env()


def setting(name, default):
    return os.environ.get(name) or ENV.get(name) or default


API_KEY = setting("GEMINI_API_KEY", "")
MODEL = setting("GEMINI_MODEL", "gemini-4-hydrogen")
TEMPERATURE = float(setting("GEMINI_TEMPERATURE", "0.95"))
MAX_OUTPUT = int(setting("GEMINI_MAX_OUTPUT_TOKENS", "8192"))
THINKING = setting("GEMINI_THINKING_LEVEL", "")
BASE_URL = setting("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com").rstrip("/")
HOST = setting("HOST", "127.0.0.1")
PORT = int(setting("PORT", "8000"))

MAX_HISTORY_CHARS = 400_000

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
}


def build_contents(messages):
    contents = []
    for message in messages:
        role = "model" if message.get("role") == "assistant" else "user"
        text = (message.get("text") or "").strip()
        if not text:
            continue
        if contents and contents[-1]["role"] == role:
            contents[-1]["parts"][0]["text"] += "\n\n" + text
        else:
            contents.append({"role": role, "parts": [{"text": text}]})

    def total_chars():
        return sum(len(item["parts"][0]["text"]) for item in contents)

    while len(contents) > 2 and total_chars() > MAX_HISTORY_CHARS:
        contents.pop(0)
        if contents and contents[0]["role"] == "model":
            contents.pop(0)
    return contents


def friendly_upstream_error(code, detail):
    try:
        message = json.loads(detail).get("error", {}).get("message", "")
    except (ValueError, AttributeError):
        message = ""
    message = message or detail[:400]
    if code == 404:
        return (
            f"Không tìm thấy model '{MODEL}'. Mở .env, sửa GEMINI_MODEL "
            f"(ví dụ gemini-2.5-flash) rồi khởi động lại server. Chi tiết: {message[:300]}"
        )
    if code == 429:
        return f"Hết hạn mức API (429). Đợi vài phút hoặc đổi model/gói. Chi tiết: {message[:300]}"
    if code in (400, 403):
        return f"Gemini từ chối yêu cầu ({code}): {message[:400]}"
    return f"Gemini lỗi {code}: {message[:400]}"


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "CoChanNhan/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urllib.parse.urlsplit(self.path).path
        if path == "/api/health":
            self.send_json(200, {"ok": True, "hasKey": bool(API_KEY), "model": MODEL})
            return
        if path == "/":
            path = "/index.html"

        target = (PUBLIC / path.lstrip("/")).resolve()
        if not target.is_relative_to(PUBLIC) or not target.is_file():
            self.send_json(404, {"error": "Not found"})
            return

        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", MIME_TYPES.get(target.suffix.lower(), "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        path = urllib.parse.urlsplit(self.path).path

        # Always drain the body first; otherwise keep-alive parses it as the
        # next request line when we answer early with an error.
        try:
            length = int(self.headers.get("Content-Length") or "0")
        except ValueError:
            length = 0
        raw_body = self.rfile.read(length) if length > 0 else b""

        if path != "/api/chat":
            self.send_json(404, {"error": "Not found"})
            return

        if not API_KEY:
            self.send_json(
                500,
                {"error": "Chưa có GEMINI_API_KEY. Mở file .env, dán API key rồi khởi động lại server."},
            )
            return

        try:
            payload = json.loads(raw_body or b"{}")
            messages = payload.get("messages") or []
            if not isinstance(messages, list) or not messages:
                raise ValueError("messages rỗng")
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": f"Yêu cầu không hợp lệ: {exc}"})
            return

        system_prompt = PROMPT_FILE.read_text(encoding="utf-8")
        body = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": build_contents(messages),
            "generationConfig": {
                "temperature": TEMPERATURE,
                "maxOutputTokens": MAX_OUTPUT,
            },
        }
        if THINKING:
            body["generationConfig"]["thinkingConfig"] = {"thinkingLevel": THINKING}

        url = (
            f"{BASE_URL}/v1beta/models/"
            f"{MODEL}:streamGenerateContent?alt=sse"
        )
        request = urllib.request.Request(
            url,
            data=json.dumps(body).encode("utf-8"),
            method="POST",
            headers={
                "Content-Type": "application/json",
                "x-goog-api-key": API_KEY,
            },
        )

        try:
            upstream = urllib.request.urlopen(request, timeout=600)
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")
            self.send_json(exc.code, {"error": friendly_upstream_error(exc.code, detail)})
            return
        except Exception as exc:  # network errors
            self.send_json(502, {"error": f"Không kết nối được Gemini: {exc}"})
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Transfer-Encoding", "chunked")
        self.end_headers()

        got_text = False
        try:
            with upstream:
                for raw_line in upstream:
                    line = raw_line.decode("utf-8", "replace").strip()
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if not data or data == "[DONE]":
                        continue
                    try:
                        event = json.loads(data)
                    except json.JSONDecodeError:
                        continue
                    if "error" in event:
                        self.send_sse({"error": event["error"].get("message", "Lỗi Gemini")})
                        break
                    for candidate in event.get("candidates", []):
                        for part in candidate.get("content", {}).get("parts", []):
                            if part.get("thought"):
                                continue
                            text = part.get("text")
                            if text:
                                got_text = True
                                self.send_sse({"t": text})
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as exc:
            try:
                self.send_sse({"error": f"Lỗi stream: {exc}"})
            except (BrokenPipeError, ConnectionResetError):
                return
        finally:
            try:
                if not got_text:
                    self.send_sse(
                        {"error": "Mô hình không trả về nội dung (có thể bị chặn an toàn hoặc hết hạn mức)."}
                    )
                self.send_sse({"done": True})
                self.wfile.write(b"0\r\n\r\n")
            except (BrokenPipeError, ConnectionResetError):
                pass
            self.close_connection = True

    def send_sse(self, payload):
        data = ("data: " + json.dumps(payload, ensure_ascii=False) + "\n\n").encode("utf-8")
        self.wfile.write(f"{len(data):X}\r\n".encode("ascii") + data + b"\r\n")


def main():
    if not PROMPT_FILE.exists():
        sys.exit(f"Thiếu prompt: {PROMPT_FILE}")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    server = ThreadingHTTPServer((HOST, PORT), Handler)
    key_state = "OK" if API_KEY else "THIẾU (điền GEMINI_API_KEY trong .env)"
    print(f"Cổ Chân Nhân GM đang chạy: http://{HOST}:{PORT}")
    print(f"Model: {MODEL} | API key: {key_state}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nĐã dừng server.")


if __name__ == "__main__":
    main()
