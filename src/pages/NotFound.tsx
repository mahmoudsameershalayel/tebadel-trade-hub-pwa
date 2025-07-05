
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Image */}
        <div className="relative max-w-md mx-auto mb-8">
          <img
            src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=500&h=300&fit=crop"
            alt="Page not found"
            className="w-full h-48 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-amber-100">Lost in the marketplace?</p>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Page not found
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
