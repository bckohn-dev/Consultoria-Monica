// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { it, expect } from 'vitest'

it('loads Firebase Auth when the server disables CommonJS require(esm)', () => {
  const output = execFileSync(process.execPath, [
    '--no-experimental-require-module', '--input-type=module', '-e',
    "await import('firebase-admin/auth'); console.log('auth-ready')",
  ], { encoding: 'utf8' })
  expect(output).toContain('auth-ready')
})
