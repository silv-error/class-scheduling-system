import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Link } from "react-router";
import useAuthHooks from "../hooks/auth.hooks";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loginIsPending } = useAuthHooks();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
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
          <Button onClick={handleSubmit} type="submit" className="w-full" disabled={loginIsPending}>
            {loginIsPending ? (
              <>
                <Loader2Icon className="animate-spin" /> Loading...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <Link to={"/signup"} className="w-full">
            <Button variant="outline" className="w-full">
              Create your account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
