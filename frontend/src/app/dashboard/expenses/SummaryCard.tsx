export const SummaryCard = ({ title, amount, description, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p
                className={`text-2xl font-bold mt-1 ${color === 'primary' ? 'text-[#C99383]' : color === 'green' ? 'text-green-600' : 'text-amber-600'}`}
            >
                €{amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
    )
}