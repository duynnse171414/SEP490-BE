import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const AboutPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md p-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">About Us</CardTitle>
                    <CardDescription className="mt-2">Learn more about our company.</CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                    <p className="text-gray-700">
                        We are a team of passionate developers dedicated to creating innovative solutions for businesses of all sizes.
                    </p>
                </CardContent>
                <CardFooter className="mt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Contact Us
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AboutPage;