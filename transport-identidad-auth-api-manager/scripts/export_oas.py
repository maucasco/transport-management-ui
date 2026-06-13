#!/usr/bin/env python3
"""Export the OpenAPI spec to docs/openapi.json.

Run from the project root:
    python scripts/export_oas.py
"""
import json
import sys
from pathlib import Path

# Add project root to path so 'app' is importable
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app  # noqa: E402

output = Path(__file__).parent.parent / "docs" / "openapi.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(app.openapi(), indent=2) + "\n")
print(f"OAS exported to {output}")
