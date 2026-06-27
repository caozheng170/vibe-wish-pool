#!/usr/bin/env python3
"""Deploy hf-space/ to Hugging Face Space caozheng/vibe-wish-analyzer."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from huggingface_hub import HfApi

REPO_ID = "caozheng/vibe-wish-analyzer"
SPACE_DIR = Path(__file__).resolve().parent.parent / "hf-space"


def main() -> None:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
    if not token:
        print(
            "Error: set HF_TOKEN (write access).\n"
            "Create at https://huggingface.co/settings/tokens\n"
            "Or run: hf auth login",
            file=sys.stderr,
        )
        sys.exit(1)

    if not SPACE_DIR.is_dir():
        print(f"Error: {SPACE_DIR} not found", file=sys.stderr)
        sys.exit(1)

    api = HfApi(token=token)

    print(f"Creating Space {REPO_ID} (docker)...")
    api.create_repo(
        repo_id=REPO_ID,
        repo_type="space",
        space_sdk="docker",
        exist_ok=True,
        private=False,
    )

    print(f"Uploading {SPACE_DIR} ...")
    api.upload_folder(
        folder_path=str(SPACE_DIR),
        repo_id=REPO_ID,
        repo_type="space",
        commit_message="Deploy vibe wish analyzer API",
    )

    print(f"Done: https://huggingface.co/spaces/{REPO_ID}")
    print(f"API URL: https://caozheng-vibe-wish-analyzer.hf.space")


if __name__ == "__main__":
    main()
