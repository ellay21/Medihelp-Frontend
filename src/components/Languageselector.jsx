"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Globe } from "lucide-react"

const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "am", name: "Amharic (አማርኛ)", flag: "🇪🇹" },
    { code: "ti", name: "Tigrinya (ትግርኛ)", flag: "🇪🇷" },
    { code: "om", name: "Oromo (Afaan Oromoo)", flag: "🇪🇹" },
    { code: "so", name: "Somali (Soomaali)", flag: "🇸🇴" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "zh-CN", name: "Chinese (中文)", flag: "🇨🇳" },
    { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵" },
    { code: "ko", name: "Korean (한국어)", flag: "🇰🇷" },
]

// Google Translate supported language codes
const googleTranslateCodes = "en,am,ti,om,so,es,fr,de,it,pt,ar,zh-CN,ja,ko"

// Helper function to get language flag
const getLanguageFlag = (code) => {
    const language = languages.find((lang) => lang.code === code)
    return language?.flag || "🌐"
}

// Simple dropdown component
function SimpleDropdown({ trigger, children }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                aria-label="Select language"
            >
                {trigger}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {children}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default function LanguageSelector() {
    const [mounted, setMounted] = useState(false)
    const [currentLanguage, setCurrentLanguage] = useState("en")
    const translateElementId = "google_translate_element"
    const scriptId = "google-translate-script"
    const styleId = "hide-google-translate-branding"

    // Add CSS to hide Google Translate elements
    const addHideTranslateCSS = () => {
        if (document.getElementById(styleId)) return

        const style = document.createElement("style")
        style.id = styleId
        style.innerHTML = `
            /* Hide Google Translate widget */
            .skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, div#goog-gt- {
                display: none !important;
            }
            
            /* Remove the top margin added by Google Translate */
            body {
                top: 0 !important;
                position: initial !important;
            }
            
            /* Fix for translation dropdown */
            .goog-te-menu-value {
                display: none !important;
            }
            
            /* Hide Google Translate attribution */
            .goog-logo-link, .goog-te-gadget {
                display: none !important;
            }
            
            /* Hide Google Translate popup */
            .goog-te-menu-frame {
                box-shadow: none !important;
            }
        `
        document.head.appendChild(style)
    }

    // Create hidden div for Google Translate
    const createHiddenElement = () => {
        if (document.getElementById(translateElementId)) return

        const div = document.createElement("div")
        div.id = translateElementId
        div.style.display = "none"
        document.body.appendChild(div)
    }

    // Initialize Google Translate
    const initializeTranslate = () => {
        if (window.googleTranslateElementInit) return

        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        autoDisplay: false,
                        includedLanguages: googleTranslateCodes,
                        multilanguagePage: true,
                    },
                    translateElementId,
                )
            }
        }
    }

    // Add Google Translate script
    const addScript = () => {
        if (document.getElementById(scriptId)) return



        const script = document.createElement("script")
        script.id = scriptId
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        script.async = true
        document.body.appendChild(script)
    }

    // Setup Google Translate
    useEffect(() => {
        addHideTranslateCSS()
        createHiddenElement()
        initializeTranslate()
        addScript()

        // Load saved preference
        const savedLanguage = localStorage.getItem("preferredLanguage")
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage)
        }

        setMounted(true)

        // Fix body position periodically
        const interval = setInterval(() => {
            if (document.body.style.top !== "0px" && document.body.style.top !== "") {
                document.body.style.top = "0px"
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    // Change language function with retry mechanism
    const changeLanguage = (languageCode) => {
        if (!mounted) return

        setCurrentLanguage(languageCode)
        localStorage.setItem("preferredLanguage", languageCode)

        const maxAttempts = 10
        let attempts = 0

        const tryChangeLanguage = () => {
            const selectElement = document.querySelector(".goog-te-combo")

            if (selectElement) {
                selectElement.value = languageCode
                selectElement.dispatchEvent(new Event("change"))
                return true
            }

            attempts++
            if (attempts < maxAttempts) {
                setTimeout(tryChangeLanguage, 300)
            } else {
                console.error("Failed to change language after multiple attempts")
                // Last resort: reload the Google Translate script
                const oldScript = document.getElementById(scriptId)
                if (oldScript) oldScript.remove()

                delete window.google.translate
                delete window.googleTranslateElementInit

                const div = document.getElementById(translateElementId)
                if (div) div.innerHTML = ""

                initializeTranslate()
                addScript()

                // Try one more time after script reload
                setTimeout(() => {
                    const selectElement = document.querySelector(".goog-te-combo")
                    if (selectElement) {
                        selectElement.value = languageCode
                        selectElement.dispatchEvent(new Event("change"))
                    }
                }, 1000)
            }
            return false
        }

        tryChangeLanguage()
    }

    // Apply saved language when component mounts and after route changes
    useEffect(() => {
        if (mounted) {
            const savedLanguage = localStorage.getItem("preferredLanguage")
            if (savedLanguage && savedLanguage !== "en") {
                setTimeout(() => {
                    changeLanguage(savedLanguage)
                }, 1000)
            }
        }
    }, [mounted, window.location.pathname])

    const currentLang = languages.find((lang) => lang.code === currentLanguage)
    
    return (
        <SimpleDropdown
            trigger={
                <>
                    <Globe className="h-5 w-5" />
                    <span className="text-sm font-medium">{currentLang?.name.split(" ")[0] || "English"}</span>
                    <ChevronDown className="h-4 w-4" />
                </>
            }
        >
            {languages.map((language) => (
                <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${
                        currentLanguage === language.code ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-semibold" : ""
                    }`}
                >
                    <span className="text-lg">{getLanguageFlag(language.code)}</span>
                    <span>{language.name}</span>
                    {currentLanguage === language.code && (
                        <span className="ml-auto text-cyan-600 dark:text-cyan-400">✓</span>
                    )}
                </button>
            ))}
        </SimpleDropdown>
    )
}
