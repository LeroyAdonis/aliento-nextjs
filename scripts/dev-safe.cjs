#!/usr/bin/env node

const { spawn, spawnSync } = require("node:child_process");

function cleanupStaleNextDevOnWindows() {
  const repoRoot = process.cwd();
  const repoRootForPs = repoRoot.replace(/'/g, "''");

  const psScript = [
    '$ErrorActionPreference = "SilentlyContinue"',
    `$repoRoot = '${repoRootForPs}'`,
    `$targets = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -like "*$repoRoot*" -and ($_.CommandLine -match "\\\\next\\\\dist\\\\" -or $_.CommandLine -match "\\\\.next\\\\dev\\\\") }`,
    "$targets | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
    'Write-Host "[dev:safe] Stopped $($targets.Count) stale Next.js process(es)."',
  ].join("; ");

  const result = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-Command", psScript],
    {
      stdio: "inherit",
      windowsHide: true,
    },
  );

  if (result.error) {
    console.warn("[dev:safe] Cleanup warning:", result.error.message);
  }
}

if (process.platform === "win32") {
  cleanupStaleNextDevOnWindows();
}

const nextBin = require.resolve("next/dist/bin/next");

const nextDev = spawn(process.execPath, [nextBin, "dev"], {
  stdio: "inherit",
  shell: false,
});

nextDev.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
