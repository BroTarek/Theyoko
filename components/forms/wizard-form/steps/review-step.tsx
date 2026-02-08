'use client';

import { FORM_FIELD_IDS } from '@/lib/constants';

export function ReviewStep() {
    return (
        <div className="space-y-6">
            {/* Review Information */}
            <div className="rounded-lg p-6 bg-[#f9f9f9] border border-secondary-grey">
                <h3 className="font-semibold mb-4 text-small text-primary-text">
                    Review Your Information
                </h3>
                <div className="space-y-3">
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Full Name:</span>{' '}
                        <span className="text-secondary-grey">Ali Tarek</span>
                    </p>
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Email:</span>{' '}
                        <span className="text-secondary-grey">Ali@gmail.com</span>
                    </p>
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Experience:</span>{' '}
                        <span className="text-secondary-grey">5-10 years</span>
                    </p>
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Regions I Worked In:</span>{' '}
                        <span className="text-secondary-grey">Jordan, Yemen, Egypt</span>
                    </p>
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Job Title:</span>{' '}
                        <span className="text-secondary-grey">Marketing Manager</span>
                    </p>
                    <p className="text-small text-primary-text">
                        <span className="font-medium">Last Company:</span>{' '}
                        <span className="text-secondary-grey">Tech Corp</span>
                    </p>
                </div>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    id={FORM_FIELD_IDS.TERMS_CONFIRMATION}
                    type="checkbox"
                    className="w-4 h-4 rounded accent-kaizen-red"
                />
                <span className="text-small text-primary-text">
                    I confirm that all information is correct
                </span>
            </label>
        </div>
    );
}
