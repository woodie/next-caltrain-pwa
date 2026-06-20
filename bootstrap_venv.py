"""Shared venv bootstrap for this repo's standalone python scripts.

Problem this solves: generate.py, update_json.py, update_pwa.py,
validate_schedule.py, and scrape.py are all run directly (./generate.py),
which invokes whatever `python3` happens to be first on PATH via the
`#!/usr/bin/env python3` shebang -- never this project's .venv, even if one
exists. On a Homebrew-managed Mac, that PATH python3 is "externally
managed" (PEP 668) and the project's actual dependencies (partridge,
beautifulsoup4) live in .venv instead, so the script fails with
ModuleNotFoundError even though the venv has everything it needs.

ensure_venv() fixes this by re-exec'ing the running script under
.venv/bin/python3, creating/repairing that venv first if it's missing or
broken (e.g. a Homebrew python upgrade removed the exact Cellar path an
old venv was symlinked to, which fails with "bad interpreter"). Call it as
the very first thing in each script's __main__ block, before importing any
third-party package:

    import bootstrap_venv
    bootstrap_venv.ensure_venv(__file__)

    import partridge as ptg  # safe to import after this point
"""

import os
import subprocess
import sys


def ensure_venv(script_file):
    repo_root = os.path.dirname(os.path.abspath(script_file))
    venv_dir = os.path.join(repo_root, ".venv")
    venv_python = os.path.join(venv_dir, "bin", "python3")
    requirements = os.path.join(repo_root, "requirements.txt")

    # Already running inside this project's venv? Comparing sys.executable's
    # realpath doesn't work here: a venv's bin/python3 is normally just a
    # symlink back to the system interpreter, so its realpath is identical
    # to the system python's -- the two are indistinguishable that way even
    # when NOT running inside the venv. sys.prefix is the reliable signal:
    # it's set to the venv's root only when actually running inside it.
    if os.path.abspath(sys.prefix) == os.path.abspath(venv_dir):
        return

    needs_build = not os.path.exists(venv_python)
    if not needs_build:
        # venv exists but may be stale/broken (e.g. its symlinked interpreter
        # was removed by a Homebrew python upgrade) -- cheap smoke test.
        probe = subprocess.run(
            [venv_python, "-c", "pass"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        needs_build = probe.returncode != 0

    if needs_build:
        print(f"[bootstrap_venv] (re)creating {venv_dir} ...", file=sys.stderr)
        if os.path.exists(venv_dir):
            subprocess.run(["rm", "-rf", venv_dir], check=True)
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)

    # Always reconcile against requirements.txt, not just on a fresh build --
    # a venv that already exists (e.g. one someone pip-installed into by hand
    # before this script existed) can be missing a package that's listed here.
    # pip is a quick no-op when everything's already satisfied, so this is
    # cheap on the common path and self-heals the rest of the time.
    subprocess.run(
        [venv_python, "-m", "pip", "install", "-q", "-r", requirements],
        check=True,
    )

    os.execv(venv_python, [venv_python] + sys.argv)
