'use client';

import { DOCUMENT_TYPES, FORM_FIELD_IDS } from '@/lib/constants';

export function DocumentsStep() {
    return (
        <div className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center border-secondary-grey">
                <svg
                    className="mx-auto h-12 w-12 mb-2 text-secondary-grey"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                    />
                </svg>
                <p className="font-medium mt-2 text-small text-primary-text">
                    Upload your documents
                </p>
                <p className="mt-1 text-small text-secondary-grey">
                    PDF, DOC, or DOCX (Max 10MB each)
                </p>
                <input
                    id={FORM_FIELD_IDS.DOCUMENTS}
                    type="file"
                    multiple
                    className="mt-4 w-full"
                    accept=".pdf,.doc,.docx"
                    aria-label="Upload documents"
                />
            </div>

            {/* Document Type */}
            <div>
                <label
                    htmlFor={FORM_FIELD_IDS.DOCUMENT_TYPE}
                    className="block font-medium mb-2 text-small text-primary-text"
                >
                    Document Type
                </label>
                <select
                    id={FORM_FIELD_IDS.DOCUMENT_TYPE}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent border border-cyan-bluish-gray bg-white text-primary-text"
                    onFocus={(e) =>
                        (e.target.style.boxShadow = '0 0 0 3px rgba(155, 81, 224, 0.1)')
                    }
                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                >
                    {DOCUMENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
