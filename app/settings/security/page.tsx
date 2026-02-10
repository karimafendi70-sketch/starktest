"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/user-context';
import { 
  ArrowLeft, 
  Shield, 
  Fingerprint, 
  Users, 
  Eye,
  Check,
  X,
  Lock
} from 'lucide-react';
import {
  getSecurityQuestions,
  hasSecurityQuestions,
  saveSecurityQuestions,
  hashSecurityAnswer,
  AVAILABLE_QUESTIONS,
  type SecurityQuestions as SecurityQuestionsType
} from '@/lib/security-questions';
import {
  isBiometricSupported,
  isPlatformAuthenticatorAvailable,
  registerBiometric
} from '@/lib/biometric-auth';
import {
  createGuestAccess,
  getUserGuestAccess,
  revokeGuestAccess
} from '@/lib/guest-access';

export default function SecuritySettings() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [hasQuestions, setHasQuestions] = useState(false);
  const [showSetupQuestions, setShowSetupQuestions] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [guestAccessCode, setGuestAccessCode] = useState<string | null>(null);

  // Security Questions Setup State
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(['', '', '']);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (currentUser) {
      setHasQuestions(hasSecurityQuestions(currentUser.id));
      
      // Check biometric availability
      isPlatformAuthenticatorAvailable().then(available => {
        setBiometricAvailable(available);
        // Check if already enabled
        const enabled = localStorage.getItem(`biometric_${currentUser.id}`) === 'true';
        setBiometricEnabled(enabled);
      });

      // Check for active guest access
      const activeAccesses = getUserGuestAccess(currentUser.id);
      if (activeAccesses.length > 0) {
        setGuestAccessCode(activeAccesses[0].code);
      }
    }
  }, [currentUser]);

  const handleSaveSecurityQuestions = async () => {
    if (!currentUser) return;

    // Validate
    if (selectedQuestions.some(q => !q) || answers.some(a => !a.trim())) {
      alert('Please fill in all questions and answers');
      return;
    }

    try {
      const questions: SecurityQuestionsType = {
        question1: {
          question: selectedQuestions[0],
          answerHash: await hashSecurityAnswer(answers[0]),
        },
        question2: {
          question: selectedQuestions[1],
          answerHash: await hashSecurityAnswer(answers[1]),
        },
        question3: {
          question: selectedQuestions[2],
          answerHash: await hashSecurityAnswer(answers[2]),
        },
      };

      saveSecurityQuestions(currentUser.id, questions);
      setHasQuestions(true);
      setShowSetupQuestions(false);
      alert('Security questions saved successfully!');
    } catch (error) {
      alert('Failed to save security questions');
    }
  };

  const handleEnableBiometric = async () => {
    if (!currentUser) return;

    try {
      const credential = await registerBiometric(currentUser.id, currentUser.username);
      if (credential) {
        localStorage.setItem(`biometric_${currentUser.id}`, 'true');
        setBiometricEnabled(true);
        alert('Biometric authentication enabled successfully!');
      }
    } catch (error) {
      alert('Failed to enable biometric authentication');
    }
  };

  const handleCreateGuestAccess = () => {
    if (!currentUser) return;

    const access = createGuestAccess(currentUser.id, 24, 'all');
    setGuestAccessCode(access.code);
    alert(`Guest access code: ${access.code}\nValid for 24 hours`);
  };

  const handleRevokeGuestAccess = () => {
    if (!currentUser || !guestAccessCode) return;

    revokeGuestAccess(guestAccessCode);
    setGuestAccessCode(null);
    alert('Guest access revoked');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Security & Privacy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Protect your journal with additional security layers
          </p>
        </motion.div>

        {/* Security Questions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Password Recovery
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up security questions to recover your password if you forget it
                </p>
              </div>
              {hasQuestions && (
                <Check className="w-6 h-6 text-green-500" />
              )}
            </div>

            {!hasQuestions ? (
              !showSetupQuestions ? (
                <button
                  onClick={() => setShowSetupQuestions(true)}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Set Up Security Questions
                </button>
              ) : (
                <div className="space-y-4 mt-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question {index + 1}
                      </label>
                      <select
                        value={selectedQuestions[index]}
                        onChange={(e) => {
                          const newQuestions = [...selectedQuestions];
                          newQuestions[index] = e.target.value;
                          setSelectedQuestions(newQuestions);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a question...</option>
                        {AVAILABLE_QUESTIONS.map((q) => (
                          <option key={q} value={q} disabled={selectedQuestions.includes(q) && selectedQuestions[index] !== q}>
                            {q}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Your answer"
                        value={answers[index]}
                        onChange={(e) => {
                          const newAnswers = [...answers];
                          newAnswers[index] = e.target.value;
                          setAnswers(newAnswers);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveSecurityQuestions}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      Save Questions
                    </button>
                    <button
                      onClick={() => setShowSetupQuestions(false)}
                      className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ Security questions are configured
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Biometric Authentication */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Fingerprint className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Biometric Unlock
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use fingerprint or face recognition to unlock your journal
                </p>
              </div>
              {biometricEnabled && (
                <Check className="w-6 h-6 text-green-500" />
              )}
            </div>

            {biometricAvailable ? (
              !biometricEnabled ? (
                <button
                  onClick={handleEnableBiometric}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Enable Biometric Authentication
                </button>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Biometric authentication is enabled
                  </p>
                </div>
              )
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Biometric authentication is not available on this device
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Guest Access */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Guest Access
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Grant temporary read-only access to your journal (24 hours)
                </p>
              </div>
            </div>

            {!guestAccessCode ? (
              <button
                onClick={handleCreateGuestAccess}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
              >
                Generate Guest Access Code
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    Active guest access code:
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 tracking-wider">
                    {guestAccessCode}
                  </p>
                </div>
                <button
                  onClick={handleRevokeGuestAccess}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  Revoke Access
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Encryption Proof */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Encryption Status
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Verify that your data is encrypted
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Your journal data is encrypted with AES-256-GCM encryption.\n\nAll entries are encrypted before being stored locally.\n\nEven if someone accesses your browser storage, they cannot read your entries without your password.');
              }}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Encryption Info
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
