'use client';

import { ReferralSourceSelect } from '@/components/forms/form-fields/referral-source-select';
import { CountryPhoneSelect } from '@/components/forms/form-fields/country-phone-select';
import { FORM_FIELD_IDS } from '@/lib/constants';

interface BasicInfoStepProps {
    fullName: string;
    setFullName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    referralSource: string;
    setReferralSource: (value: string) => void;
    countryCode: string;
    setCountryCode: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
}

export function BasicInfoStep({
    fullName,
    setFullName,
    email,
    setEmail,
    referralSource,
    setReferralSource,
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
}: BasicInfoStepProps) {
    return (
        <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
                <label
                    htmlFor={FORM_FIELD_IDS.FULL_NAME}
                    className="block font-medium text-sm text-primary-text transition-colors duration-200"
                >
                    Full Name
                </label>
                <div className="relative">
                    <input
                        id={FORM_FIELD_IDS.FULL_NAME}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-primary-text 
              placeholder:text-gray-400 placeholder:text-sm
              focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500
              hover:border-gray-400 transition-all duration-200 ease-in-out
              shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-lg ring-0 ring-gray-500/20 pointer-events-none transition-all duration-200" />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label
                    htmlFor={FORM_FIELD_IDS.EMAIL}
                    className="block font-medium text-sm text-primary-text transition-colors duration-200"
                >
                    Email
                </label>
                <div className="relative">
                    <input
                        id={FORM_FIELD_IDS.EMAIL}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-primary-text 
              placeholder:text-gray-400 placeholder:text-sm
              focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500
              hover:border-gray-400 transition-all duration-200 ease-in-out
              shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-lg ring-0 ring-gray-500/20 pointer-events-none transition-all duration-200" />
                </div>
            </div>

            {/* Referral Source */}
            <ReferralSourceSelect
                value={referralSource}
                onChange={setReferralSource}
                placeholder="Select how you heard about us"
            />

            {/* Phone Number */}
            <div className="space-y-2">
                <label
                    htmlFor={FORM_FIELD_IDS.PHONE}
                    className="block font-medium text-sm text-primary-text transition-colors duration-200"
                >
                    Phone Number
                </label>
                <CountryPhoneSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    phoneValue={phoneNumber}
                    onPhoneChange={setPhoneNumber}
                    placeholder="1551172132"
                />
                <p className="text-xs text-gray-500 pt-1">
                    We'll only contact you about your inquiry
                </p>
            </div>
        </div>
    );
}
