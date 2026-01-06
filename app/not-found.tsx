import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 text-sm md:text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
