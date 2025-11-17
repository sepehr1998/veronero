"use client"
import { useState } from 'react'
import {
    EyeIcon,
    EyeOffIcon,
    ArrowRightIcon
} from 'lucide-react'
import axios from "axios"

import AuthInfoSection from "@/app/dashboard/auth/AuthInfoSection";

export default function Authentication () {
    const [activeTab, setActiveTab] = useState('signin')
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            setEmailError('Email is required')
            return false
        } else if (!re.test(email)) {
            setEmailError('Please enter a valid email address')
            return false
        } else {
            setEmailError('')
            return true
        }
    }
    const validatePassword = (password: any) => {
        if (!password) {
            setPasswordError('Password is required')
            return false
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters')
            return false
        } else {
            setPasswordError('')
            return true
        }
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const isEmailValid = validateEmail(email)
        const isPasswordValid = validatePassword(password)
        if (isEmailValid && isPasswordValid) {
            // Handle form submission
            console.log('Form submitted', {
                email,
                password,
                firstName,
                lastName,
            })
            const formData = {email, firstName, lastName, password}
            try {
                await axios.post("https://api.veronero.fi/api/signup", formData)
            } catch (e) {
                console.log(e)
            }
        }
    }
    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-primary">VeroNero</h1>
                        <p className="text-sm text-gray-500 mt-1">Finnish Tax Assistant</p>
                    </div>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-8">
                        <button
                            className={`flex-1 py-3 font-medium text-sm ${activeTab === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('signin')}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-3 font-medium text-sm ${activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('signup')}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* SignUp Form */}
                    <form onSubmit={handleSubmit}>
                        {activeTab === 'signup' && (
                            <>
                                <div className="mb-4">
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </>

                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => validateEmail(email)}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="name@company.com"
                            />
                            {emailError && (
                                <p className="mt-1 text-xs text-red-500">{emailError}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => validatePassword(password)}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon size={18} />
                                    ) : (
                                        <EyeIcon size={18} />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                            )}
                        </div>
                        {activeTab === 'signup' && (
                            <>
                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={agreeToTerms}
                                            onChange={() => setAgreeToTerms(!agreeToTerms)}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                                            <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                                            and{' '}
                                            <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                                    </label>
                                </div>
                            </>
                        )}
                        {activeTab === 'signin' && (
                            <div className="flex items-center justify-between mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                                </label>
                                <a href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={activeTab === 'signup' && !agreeToTerms}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${activeTab === 'signup' && !agreeToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                            <ArrowRightIcon size={16} className="ml-2" />
                        </button>
                    </form>
                    {activeTab === 'signin' && (
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setActiveTab('signup')}
                                className="font-medium text-primary hover:underline cursor-pointer"
                            >
                                Create one
                            </button>
                        </p>
                    )}
                    {activeTab === 'signup' && (
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => setActiveTab('signin')}
                                className="font-medium text-primary hover:underline cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </div>

            {/* Right side - Features */}
            <AuthInfoSection />
        </div>
    )
}

