import * as crypto from 'crypto'

// Function to generate a strong password that meets common requirements
export function generateStrongPassword(): string {
  // Base64 encoding makes it more readable while still random
  // Adding special chars and ensuring it has the right format
  const randomBytes = crypto.randomBytes(24).toString('base64')
  // Ensure password has at least one special character and number
  return `${randomBytes}!1Aa`
}