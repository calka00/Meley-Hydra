# Debian local launcher

## Goal

Provide one shell script that builds and serves the tracker locally on Debian/PVE.

## Behavior

- Script runs from any current directory using its own directory as project root.
- Checks for `node` and `npm`; prints install guidance and exits non-zero when missing.
- Runs `npm ci` only when `node_modules/.bin/vite` is absent.
- Runs `npm run build` before serving.
- Serves production `dist` through Vite preview on `0.0.0.0:4173`.
- Prints local and LAN access URL.
- Stops cleanly with `Ctrl+C`.
- Does not alter firewall or install global packages.

## File

- `start.sh`: executable Debian launcher.

## Verification

- Shell syntax check with `bash -n start.sh`.
- Existing npm tests and production build pass.
- Preview responds on configured port.
