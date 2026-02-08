'use client';

import { FORM_FIELD_IDS } from '@/lib/constants';

export function AccountSetupStep() {
    return (
        <div className="space-y-6">
            {/* Username */}
            <div>
                <label
                    htmlFor={FORM_FIELD_IDS.USERNAME}
                    className="block font-medium mb-2 text-small text-primary-text"
                >
                    Username
                </label>
                <input
                    id={FORM_FIELD_IDS.USERNAME}
                    type="text"
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent border border-cyan-bluish-gray bg-white text-primary-text"
                    onFocus={(e) =>
                        (e.target.style.boxShadow = '0 0 0 3px rgba(155, 81, 224, 0.1)')
                    }
                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
            </div>

            {/* Password */}
            <div>
                <label
                    htmlFor={FORM_FIELD_IDS.PASSWORD}
                    className="block font-medium mb-2 text-small text-primary-text"
                >
                    Password
                </label>
                <input
                    id={FORM_FIELD_IDS.PASSWORD}
                    type="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent border border-cyan-bluish-gray bg-white text-primary-text"
                    onFocus={(e) =>
                        (e.target.style.boxShadow = '0 0 0 3px rgba(155, 81, 224, 0.1)')
                    }
                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
            </div>

            {/* Confirm Password */}
            <div>
                <label
                    htmlFor={FORM_FIELD_IDS.CONFIRM_PASSWORD}
                    className="block font-medium mb-2 text-small text-primary-text"
                >
                    Confirm Password
                </label>
                <input
                    id={FORM_FIELD_IDS.CONFIRM_PASSWORD}
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent border border-cyan-bluish-gray bg-white text-primary-text"
                    onFocus={(e) =>
                        (e.target.style.boxShadow = '0 0 0 3px rgba(155, 81, 224, 0.1)')
                    }
                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
            </div>
        </div>
    );
}
