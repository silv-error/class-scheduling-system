import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Link } from "react-router";

import toast from "react-hot-toast";
import useAuthHooks from "../hooks/auth.hooks";
import { Loader2Icon } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const { signup, signupIsPending } = useAuthHooks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      return toast.error("All fields are required", { id: "signup" });
    }
    signup(formData);
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleOnChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="email">First Name</label>
                  <Input
                    id="fname"
                    type="text"
                    name="firstName"
                    onChange={handleOnChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Last Name</label>
                  <Input id="lname" type="text" name="lastName" onChange={handleOnChange} placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleOnChange}
                  placeholder="********"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={handleSubmit} type="submit" className="w-full" disabled={signupIsPending}>
            {signupIsPending ? (
              <>
                <Loader2Icon className="animate-spin" /> Loading...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <Link to={"/login"} className="w-full">
            <Button variant="outline" className="w-full">
              Already have an account?
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
