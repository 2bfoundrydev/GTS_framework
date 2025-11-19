export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Test Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h1 className="text-title-lg text-gray-900 dark:text-white mb-4">
            Tailwind v4 Test Page
          </h1>
          <p className="text-theme-sm text-gray-600 dark:text-gray-400">
            Testing различных стилей из TailAdmin
          </p>
        </div>

        {/* Test Brand Colors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Brand Colors (должны работать)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-brand-500 text-white p-4 rounded-lg text-center">
              brand-500
            </div>
            <div className="bg-brand-400 text-white p-4 rounded-lg text-center">
              brand-400
            </div>
            <div className="bg-brand-600 text-white p-4 rounded-lg text-center">
              brand-600
            </div>
          </div>
        </div>

        {/* Test Gray Colors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Gray Colors (должны работать)
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 text-gray-900 p-4 rounded-lg text-center border border-gray-200">
              gray-50
            </div>
            <div className="bg-gray-100 text-gray-900 p-4 rounded-lg text-center">
              gray-100
            </div>
            <div className="bg-gray-500 text-white p-4 rounded-lg text-center">
              gray-500
            </div>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-center">
              gray-900
            </div>
          </div>
        </div>

        {/* Test Blue-Light Colors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Blue-Light Colors
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-light-400 text-white p-4 rounded-lg text-center">
              blue-light-400
            </div>
            <div className="bg-blue-light-500 text-white p-4 rounded-lg text-center">
              blue-light-500
            </div>
            <div className="bg-blue-light-600 text-white p-4 rounded-lg text-center">
              blue-light-600
            </div>
          </div>
        </div>

        {/* Test Success/Error Colors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Status Colors
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-success-500 text-white p-4 rounded-lg text-center">
              success-500
            </div>
            <div className="bg-error-500 text-white p-4 rounded-lg text-center">
              error-500
            </div>
            <div className="bg-warning-500 text-white p-4 rounded-lg text-center">
              warning-500
            </div>
          </div>
        </div>

        {/* Test Custom Shadows */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Custom Shadows
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-theme-sm">
              shadow-theme-sm
            </div>
            <div className="bg-white p-4 rounded-lg shadow-theme-md">
              shadow-theme-md
            </div>
            <div className="bg-white p-4 rounded-lg shadow-theme-lg">
              shadow-theme-lg
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Brand Button
            </button>
            <button className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Success Button
            </button>
            <button className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Error Button
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
              Gray Button
            </button>
          </div>
        </div>

        {/* Test Custom Text Sizes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Custom Text Sizes
          </h2>
          <div className="space-y-2">
            <p className="text-title-2xl text-gray-900 dark:text-white">text-title-2xl</p>
            <p className="text-title-xl text-gray-900 dark:text-white">text-title-xl</p>
            <p className="text-title-lg text-gray-900 dark:text-white">text-title-lg</p>
            <p className="text-title-md text-gray-900 dark:text-white">text-title-md</p>
            <p className="text-title-sm text-gray-900 dark:text-white">text-title-sm</p>
            <p className="text-theme-xl text-gray-900 dark:text-white">text-theme-xl</p>
            <p className="text-theme-sm text-gray-900 dark:text-white">text-theme-sm</p>
            <p className="text-theme-xs text-gray-900 dark:text-white">text-theme-xs</p>
          </div>
        </div>

        {/* Test Z-Index */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-theme-md">
          <h2 className="text-title-sm text-gray-900 dark:text-white mb-4">
            Z-Index Values
          </h2>
          <div className="relative h-32">
            <div className="absolute inset-0 bg-gray-200 z-1 p-2">z-1</div>
            <div className="absolute inset-4 bg-brand-200 z-9 p-2">z-9</div>
            <div className="absolute inset-8 bg-brand-400 z-99 p-2 text-white">z-99</div>
          </div>
        </div>

      </div>
    </div>
  );
}

