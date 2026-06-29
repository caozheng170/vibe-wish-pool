#!/usr/bin/env python3
"""Set CLOUD_API_KEY on HF Space from env var (never commit the key)."""

import os
import sys

from huggingface_hub import HfApi

REPO_ID = "caozheng/vibe-wish-analyzer"


def main() -> None:
    key = os.environ.get("CLOUD_API_KEY")
    if not key:
        print("Usage: $env:CLOUD_API_KEY='sk-...'; py scripts/set_agnes_secret.py", file=sys.stderr)
        sys.exit(1)

    api = HfApi()
    api.add_space_secret(repo_id=REPO_ID, key="CLOUD_API_KEY", value=key)
    print(f"CLOUD_API_KEY set on {REPO_ID}")


if __name__ == "__main__":
    main()
