
"""
Password hashing and JWT handling using ONLY Python's standard library
(hashlib, hmac, base64, json).
"""

import base64
import hashlib
import hmac
import json
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.core.config import settings

# -----------------------------
# Password hashing (PBKDF2)
# -----------------------------

_PBKDF2_ITERATIONS = 260_000
_SALT_BYTES = 16


def get_password_hash(password: str) -> str:
    salt = os.urandom(_SALT_BYTES)

    derived = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        _PBKDF2_ITERATIONS
    )

    return "pbkdf2_sha256${}${}${}".format(
        _PBKDF2_ITERATIONS,
        base64.b64encode(salt).decode("ascii"),
        base64.b64encode(derived).decode("ascii"),
    )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        algo, iterations_str, salt_b64, hash_b64 = hashed_password.split("$")
        if algo != "pbkdf2_sha256":
            return False

        iterations = int(iterations_str)
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(hash_b64)

    except (ValueError, TypeError):
        return False

    actual = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        salt,
        iterations
    )

    return hmac.compare_digest(actual, expected)


# -----------------------------
# Base64 helpers
# -----------------------------

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


# -----------------------------
# JWT creation
# -----------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    header = {"alg": "HS256", "typ": "JWT"}

    payload = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload["exp"] = int(expire.timestamp())

    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode())
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode())

    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")

    signature = hmac.new(
        settings.secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256
    ).digest()

    signature_b64 = _b64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


# -----------------------------
# JWT decoding
# -----------------------------

def decode_access_token(token: str) -> Optional[dict]:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")

        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")

        expected_signature = hmac.new(
            settings.secret_key.encode("utf-8"),
            signing_input,
            hashlib.sha256
        ).digest()

        actual_signature = _b64url_decode(signature_b64)

        if not hmac.compare_digest(expected_signature, actual_signature):
            return None

        payload = json.loads(_b64url_decode(payload_b64))

        exp = payload.get("exp")
        if exp is not None:
            if datetime.now(timezone.utc).timestamp() > float(exp):
                return None

        return payload

    except (ValueError, TypeError, json.JSONDecodeError):
        return None
