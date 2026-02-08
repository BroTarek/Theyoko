'use client';

import { useState } from 'react';
import { WizardHeader } from './wizard-header';
import { WizardProgress } from './wizard-progress';
import { WizardNavigation } from './wizard-navigation';
import { BasicInfoStep } from './steps/basic-info-step';
import { ExperienceStep } from './steps/experience-step';
import { AboutMeStep } from './steps/about-me-step';
import { DocumentsStep } from './steps/documents-step';
import { ReviewStep } from './steps/review-step';
import { WIZARD_STEPS } from '@/lib/constants';

export function WizardForm() {
    // Wizard state
    const [currentStep, setCurrentStep] = useState(1);

    // Form state - Basic Info
    const [referralSource, setReferralSource] = useState<string>('');
    const [countryCode, setCountryCode] = useState('+966');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Form state - Experience
    const [selectedExperience, setSelectedExperience] = useState<string>('');
    const [selectedFields, setSelectedFields] = useState<string[]>(['']);

    // Form state - About Me
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [company, setCompany] = useState('');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    // Navigation handlers
    const handleNext = () => {
        if (currentStep < WIZARD_STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepId: number) => {
        setCurrentStep(stepId);
    };

    // Render current step content
    const renderFormContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        referralSource={referralSource}
                        setReferralSource={setReferralSource}
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                    />
                );
            case 2:
                return (
                    <ExperienceStep
                        selectedExperience={selectedExperience}
                        setSelectedExperience={setSelectedExperience}
                        selectedFields={selectedFields}
                        setSelectedFields={setSelectedFields}
                    />
                );
            case 3:
                return (
                    <AboutMeStep
                        selectedPosition={selectedPosition}
                        setSelectedPosition={setSelectedPosition}
                        company={company}
                        setCompany={setCompany}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries}
                    />
                );
            case 4:
                return <DocumentsStep />;
            case 5:
                return <ReviewStep />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <WizardHeader
                        currentStep={currentStep}
                        totalSteps={WIZARD_STEPS.length}
                    />

                    {/* Progress Indicator */}
                    <WizardProgress
                        steps={WIZARD_STEPS}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                {/* Form Content */}
                <div className="rounded-2xl shadow-lg p-8 bg-white border border-secondary-grey">
                    {renderFormContent()}

                    {/* Navigation Buttons */}
                    <WizardNavigation
                        currentStep={currentStep}
                        totalSteps={WIZARD_STEPS.length}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                </div>
            </div>
        </div>
    );
}
