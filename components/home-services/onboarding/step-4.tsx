import { useState, useCallback, FormEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { ImagePlus, Loader2 } from 'lucide-react'
import {  useRouter, useSearchParams } from 'next/navigation'
import { ProgressBar } from "@/components/home-services/onboarding/ProgressBar";

const ONBOARDING_STEPS = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Reviews' },
  { id: 3, name: 'Preferences' },
  { id: 4, name: 'Location' },
  { id: 5, name: 'Payment' },
  { id: 6, name: 'Background' },
];


const DEFAULT_LOGO = '/service_profile.jpg'

const BusinessInfo = () => {
  const [isPending, setPending] = useState(false)
  const router = useRouter()
  const [currentStep] = useState(1);


  // Get service Id
  const params = useSearchParams()
  const serviceId = params.get('id')

  // Track selected businessType in local state
  const [businessType, setBusinessType] = useState<'company' | 'handyman' | 'Sub-Contractor'>('company')

  // Local state for Dropzone
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Dropzone callback
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    setLogoFile(file)
    setPreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  })

  const handleRemove = () => {
    setLogoFile(null)
    setPreview(null)
  }

  const handleBusiness = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    if(serviceId)
    {
      router.back()
    }
    router.push('/home-services/dashboard/services/step-5')
  }

  return (
    <div>

      {!serviceId && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          steps={ONBOARDING_STEPS}
          className="mb-8"
        />
      )}
      <form onSubmit={handleBusiness} className="mx-6">
        <section className="border-b border-gray-200 dark:border-gray-700 pb-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Business Profile Setup
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This information is visible to customers looking for services.
          </p>

          {/* Logo Upload */}
          <div className="sm:col-span-1 mt-6">
            <label
              htmlFor="logoUpload"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Business Profile (Logo)
            </label>

            <div
              {...getRootProps()}
              id="logoUpload"
              className={`
              relative w-36 h-36 border-2 border-dashed rounded-full bg-gray-50 dark:bg-gray-800
              flex items-center justify-center cursor-pointer transition-colors
              ${isDragActive
                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#0077B6]'
                }`}
            >
              <input
                {...getInputProps({ name: 'image', id: 'logoUpload' })}
                aria-label="Upload business logo"
              />

              <Image
                src={preview || DEFAULT_LOGO}
                alt="Logo Preview"
                fill
                className="object-cover rounded-full shadow-sm"
                sizes="144px"
              />

              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center space-y-2 transition-opacity">
                {logoFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    className="text-white bg-red-600 px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    open()
                  }}
                  className="flex items-center gap-1 text-white bg-[#0077B6] px-3 py-1 rounded text-xs font-semibold hover:bg-[#004fb6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ImagePlus className="w-4 h-4" />
                  {logoFile ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 text-[13px]">
            {/* Business Type */}
            <div className="sm:col-span-3">
              <label
                htmlFor="business-type"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Business Type
              </label>
              <select
                id="business-type"
                name="businessType"
                value={businessType}
                onChange={(e) =>
                  setBusinessType(e.target.value as 'company' | 'handyman' | 'Sub-Contractor')
                }
                className="mt-2 block w-full appearance-none rounded-[4px] bg-white dark:bg-gray-900 py-1.5 pl-3 pr-8 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              >
                <option value="company">Company</option>
                <option value="handyman">Handyman</option>
                <option value="Sub-Contractor">Sub-Contractor</option>
              </select>
            </div>

            {/* Conditionally render “Number of Employees” only if businessType === "company" */}
            {businessType === 'company' && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="employees"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-200"
                >
                  Number of Employees
                </label>
                <input
                  id="employees"
                  name="employees"
                  type="number"
                  min={0}
                  placeholder="Ex: 14"
                  className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
                />

              </div>
            )}

            {businessType === 'Sub-Contractor' && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="employees"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-200"
                >
                  Number of Employees
                </label>
                <input
                  id="employees"
                  name="employees"
                  type="number"
                  min={0}
                  placeholder="Ex: 14"
                  className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
                />

              </div>
            )}


            <div className="sm:col-span-full">
              <label
                htmlFor="founded"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Founded Year
              </label>
              <input
                id="founded"
                name="founded"
                type="number"
                min={1800}
                placeholder="Ex: 2014"
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              />
            </div>

            {/* Why Hire Section */}
            <div className="sm:col-span-6 mt-6">
              <label
                htmlFor="why-hire"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 text-[13px]"
              >
                Why should customers hire you?
              </label>
              <textarea
                id="why-hire"
                name="about"
                rows={4}
                placeholder="Explain what makes your business stand out and why you'll do a great job."
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-1"
              />
              <div className="mt-2 text-gray-600 dark:text-gray-400 text-[13px]">
                <p>You can mention:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Years in business</li>
                  <li>What you are passionate about</li>
                  <li>Special skills or equipment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px] ">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="text-white text-[13px] py-2 px-6 rounded-[4px] bg-[#0077B6] hover:bg-[#005f8e] transition"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />}

            Next
          </button>
        </div>
      </form>
    </div>
  )
}

export default BusinessInfo