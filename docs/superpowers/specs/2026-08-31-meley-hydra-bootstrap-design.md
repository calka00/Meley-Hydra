# Meley-Hydra bootstrap

## Goal

Clone `https://github.com/calka00/Meley-Hydra` into current empty folder, build project using upstream-supported build command, and provide Windows `start.bat` launcher.

## Scope

- Repository contents become workspace root; no extra parent checkout directory.
- Build process comes from upstream documentation and project configuration.
- `start.bat` runs built application only.
- If required build artifact is missing, launcher exits non-zero with build instruction.

## Error handling

- Clone and build failures retain command output and exit non-zero.
- Launcher forwards application exit code.

## Verification

- Confirm repository clone completes.
- Run upstream build command successfully.
- Invoke `start.bat` and confirm application starts or reports upstream runtime prerequisite clearly.
