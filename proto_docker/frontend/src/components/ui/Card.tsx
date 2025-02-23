interface CardProps {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ title, children, className = "" }: CardProps) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {children}
      </div>
    );
  }