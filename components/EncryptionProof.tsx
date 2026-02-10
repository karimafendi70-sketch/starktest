"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { encrypt, decrypt, uint8ArrayToBase64 } from '@/lib/crypto';

interface EncryptionProofProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoKey: CryptoKey | null;
  salt: Uint8Array | null;
}

export function EncryptionProof({ isOpen, onClose, cryptoKey, salt }: EncryptionProofProps) {
  const [sampleText, setSampleText] = useState("Today I felt really happy and grateful for everything in my life.");
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedData, setDecryptedData] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleEncrypt = async () => {
    if (!cryptoKey || !salt) return;
    
    setIsEncrypting(true);
    setError('');
    try {
      const { ciphertext, iv } = await encrypt(sampleText, cryptoKey);
      
      // Convert to base64 for display
      const ciphertextArray = new Uint8Array(ciphertext);
      const ciphertextB64 = uint8ArrayToBase64(ciphertextArray);
      const ivB64 = uint8ArrayToBase64(iv);
      const combined = `${ciphertextB64}.${ivB64}`;
      setEncryptedData(combined);
      
      // Also decrypt it to show it works
      const decrypted = await decrypt(ciphertext, cryptoKey, iv);
      setDecryptedData(decrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      setError('Failed to encrypt/decrypt. Please try again.');
    }
    setIsEncrypting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Encryption Proof
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Sample Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sample Text (try editing this)
                </label>
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              {/* Encrypt Button */}
              <button
                onClick={handleEncrypt}
                disabled={isEncrypting || !cryptoKey}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {isEncrypting ? 'Encrypting...' : '🔒 Encrypt Text'}
              </button>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Results Grid */}
              {encryptedData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Text */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Original Text (Plaintext)
                      </h3>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                        {sampleText}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      ✓ Human readable
                    </p>
                  </div>

                  {/* Encrypted Data */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <EyeOff className="w-4 h-4 text-red-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Encrypted Data (Stored)
                      </h3>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-gray-900 dark:text-white font-mono text-xs break-all">
                        {encryptedData}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      ✗ Completely unreadable
                    </p>
                  </div>

                  {/* Decrypted Text (Proof) */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Decrypted Text (After Login)
                      </h3>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                        {decryptedData}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      ✓ Matches original perfectly
                    </p>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                  🔐 How It Works
                </h3>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>• Your password creates a unique encryption key</li>
                  <li>• AES-256-GCM encrypts your text into unreadable data</li>
                  <li>• Encrypted data is stored locally (never sent to cloud)</li>
                  <li>• Only your password can decrypt and read your entries</li>
                  <li>• Even the app developer cannot read your encrypted data</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
