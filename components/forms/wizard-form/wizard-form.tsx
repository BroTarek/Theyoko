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
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [referralSource, setReferralSource] = useState<string>('');
    const [countryCode, setCountryCode] = useState('+966');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Form state - Experience
    const [selectedExperience, setSelectedExperience] = useState<string>('');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    // Form state - About Me
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [company, setCompany] = useState('');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [achievements, setAchievements] = useState('');

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

    const handleComplete = async () => {
        const formData = {
            full_name: fullName,
            email: email,
            phone_number: `${countryCode}${phoneNumber}`,
            referral_source: referralSource,
            experience_level: selectedExperience,
            fields: selectedFields,
            position: selectedPosition,
            company: company,
            countries_worked_in: selectedCountries,
            achievements: achievements,
            // documents: [] // We can handle documents later if needed
        };

        try {
            const response = await fetch('http://localhost:5000/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Form submitted successfully! ID: ' + result.id);
                // Optionally reset form or redirect
            } else {
                alert('Failed to submit form.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred during submission.');
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
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
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
                        achievements={achievements}
                        setAchievements={setAchievements}
                    />
                );
            case 4:
                return <DocumentsStep />;
            case 5:
                return (
                    <ReviewStep
                        data={{
                            fullName,
                            email,
                            experience: selectedExperience,
                            countries: selectedCountries,
                            position: selectedPosition,
                            company,
                        }}
                    />
                );
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
                        onComplete={handleComplete}
                    />
                </div>
            </div>
        </div>
    );
}
