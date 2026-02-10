/**
 * Biometric authentication using WebAuthn API
 */

export interface BiometricCredential {
  id: string;
  publicKey: string;
  counter: number;
}

/**
 * Check if WebAuthn is supported
 */
export function isBiometricSupported(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    navigator.credentials
  );
}

/**
 * Check if platform authenticator is available
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isBiometricSupported()) return false;
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/**
 * Register biometric credential
 */
export async function registerBiometric(
  userId: string,
  username: string
): Promise<BiometricCredential | null> {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication is not supported');
  }

  try {
    // Generate challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Encrypted Journal',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to create credential');
    }

    // Extract credential data
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    const response = credential.response as AuthenticatorAttestationResponse;
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(response.getPublicKey()!)));

    const biometricCredential: BiometricCredential = {
      id: credentialId,
      publicKey,
      counter: 0,
    };

    // Save credential
    saveBiometricCredential(userId, biometricCredential);

    return biometricCredential;
  } catch (error) {
    console.error('Biometric registration error:', error);
    return null;
  }
}

/**
 * Authenticate with biometric
 */
export async function authenticateBiometric(
  userId: string
): Promise<boolean> {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication is not supported');
  }

  const credential = getBiometricCredential(userId);
  if (!credential) {
    throw new Error('No biometric credential found');
  }

  try {
    // Generate challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Convert credential ID back to ArrayBuffer
    const credentialId = Uint8Array.from(atob(credential.id), c => c.charCodeAt(0));

    // Get assertion
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [{
          type: 'public-key',
          id: credentialId,
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!assertion) {
      return false;
    }

    // In a real implementation, you would verify the signature here
    // For this client-side only app, we'll trust the platform authenticator
    return true;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
}

/**
 * Save biometric credential
 */
function saveBiometricCredential(
  userId: string,
  credential: BiometricCredential
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    `user_${userId}_biometric`,
    JSON.stringify(credential)
  );
}

/**
 * Get biometric credential
 */
function getBiometricCredential(userId: string): BiometricCredential | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(`user_${userId}_biometric`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if user has biometric enabled
 */
export function hasBiometricEnabled(userId: string): boolean {
  return getBiometricCredential(userId) !== null;
}

/**
 * Remove biometric credential
 */
export function removeBiometricCredential(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`user_${userId}_biometric`);
}
