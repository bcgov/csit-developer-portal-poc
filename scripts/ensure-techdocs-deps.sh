#!/usr/bin/env bash
set -euo pipefail

venv_dir=".venv-techdocs"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required for local TechDocs generation." >&2
  exit 1
fi

if [ ! -x "${venv_dir}/bin/python" ]; then
  if ! python3 -m venv "${venv_dir}" >/dev/null 2>&1; then
    echo "Unable to create ${venv_dir}." >&2
    echo "Install the Python venv package, then rerun yarn start." >&2
    echo "On Debian/Ubuntu, this is usually: sudo apt install python3-venv" >&2
    exit 1
  fi
fi

"${venv_dir}/bin/python" -m pip install --disable-pip-version-check -r techdocs-requirements.txt
