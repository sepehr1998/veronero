import {BarChart3Icon, CalendarIcon, FileTextIcon, ReceiptIcon, TrendingUpIcon} from "lucide-react";

export default function AuthInfoSection() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-hover to-primary">
            <div className="w-full flex flex-col items-center justify-center px-12 text-white">
                <div className="max-w-md text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Simplify Your Finnish Taxes
                    </h2>
                    <p className="text-white mb-10">
                        VeroNero uses artificial intelligence to help freelancers,
                        entrepreneurs, and small businesses optimize their taxes in
                        Finland.
                    </p>
                    <div className="space-y-6">
                        <Feature
                            icon={<BarChart3Icon size={24} />}
                            title="Smart Dashboard"
                            description="Get a clear overview of your tax situation with personalized insights and recommendations."
                        />
                        <Feature
                            icon={<CalendarIcon size={24} />}
                            title="Tax Calendar"
                            description="Never miss important tax deadlines with automated reminders and a visual calendar."
                        />
                        <Feature
                            icon={<FileTextIcon size={24} />}
                            title="AI Tax Analysis"
                            description="Upload your tax documents and our AI will analyze them to find optimization opportunities."
                        />
                        <Feature
                            icon={<TrendingUpIcon size={24} />}
                            title="Tax Optimizer"
                            description="Interactive tools to help you make better financial decisions and minimize your tax burden."
                        />
                        <Feature
                            icon={<ReceiptIcon size={24} />}
                            title="Expense Manager"
                            description="Easily track and categorize your expenses for maximum tax deductions."
                        />
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <div className="flex space-x-2 mb-4">
                            <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                        </div>
                        <p className="text-blue-200 italic text-sm">
                            "VeroNero saved me over €2,000 in taxes last year by identifying
                            deductions I didn't know I was eligible for!"
                        </p>
                        <p className="text-blue-100 font-medium mt-2">
                            — Matti Virtanen, Freelance Designer
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Feature = ({ icon, title, description }) => {
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 p-2 bg-primary rounded-lg">{icon}</div>
            <div className="ml-4 text-left">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-white">{description}</p>
            </div>
        </div>
    )
}
