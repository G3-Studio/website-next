'use client';
import Loading from '@/components/Loading';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loading></Loading>;
  } else if (status === 'authenticated') {
    router.push('/admin');
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await signIn('credentials', {
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex w-full" id="container">
        <div className="flex flex-col w-full font-sans lg:w-1/2">
          <div className="flex justify-center pt-12 lg:justify-start lg:pl-12 lg:-mb-24">
            <Link href="/" className="p-4 text-xl font-bold">
              <svg
                version="1.1"
                viewBox="0 0 270.93 270.93"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-16 h-16 logo">
                <defs>
                  <linearGradient id="Gradient1" x1={0} x2={0} y1={0} y2={1}>
                    <stop offset="0%" stopColor="#fa485d" />
                    <stop offset="100%" stopColor="#fdb814" />
                  </linearGradient>
                </defs>
                <g transform="translate(-3.6015 -22.924)">
                  <path
                    fill="url(#Gradient1)"
                    transform="matrix(1.8189 0 0 1.8189 -52.28 -68.104)"
                    d="m105.2 58.422s-3.9159 15.867-7.4902 26.041c-3.5743 10.174-7.1915 17.599-10.811 21.963 3.0092 5.39 5.3823 10.406 6.8457 15.014 3.7666 11.859 2.8751 24.231 2.2754 32.65-0.62273 8.7428-3.5185 18.497-6.0625 26.283 6.2762 3.3438 15.242 10.256 15.242 10.256s9.8997-7.3446 15.244-10.256c-2.544-7.786-5.4398-17.54-6.0625-26.283-0.59968-8.4192-1.4912-20.791 2.2754-32.65 1.4634-4.6076 3.8365-9.6237 6.8457-15.014-3.619-4.3641-7.2362-11.789-10.811-21.963-2.9301-8.5476-7.4922-26.041-7.4922-26.041zm-19.481 119.32s5.658-13.814 6.0985-28.878c0.45205-15.457-2.0708-23.676-2.0708-23.676s-5.5901 11.763-18.036 18.053c-12.48 6.3068-24.763 2.2827-24.763 2.2827s3.6629 12.788 21.794 16.886c16.95 3.8308 16.977 15.333 16.977 15.333zm38.963 0s-5.658-13.814-6.0985-28.878c-0.45206-15.457 2.0708-23.676 2.0708-23.676s5.5901 11.763 18.036 18.053c12.48 6.3068 24.763 2.2827 24.763 2.2827s-3.6629 12.788-21.794 16.886c-16.95 3.8308-16.977 15.333-16.977 15.333z"
                  />
                </g>
              </svg>
            </Link>
          </div>
          <div className="flex flex-col justify-center px-8 pt-8 my-auto lg:justify-start lg:pt-0 lg:px-24 xl:px-32">
            <h1 className="text-4xl font-bold text-center">Welcome.</h1>
            <h2 className="text-xl font-normal text-center text-gray-500">Admin Panel Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col pt-3 lg:pt-8">
              <div className="flex flex-col pt-4">
                <label htmlFor="email" className="text-lg font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-3 py-3 mt-1 leading-tight text-gray-700 transition-all duration-100 border-2 rounded-lg appearance-none focus: focus:border-official-orange focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col pt-4">
                <label htmlFor="password" className="text-lg font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full px-3 py-3 mt-1 leading-tight text-gray-700 transition-all duration-100 border-2 rounded-lg appearance-none focus: focus:border-official-orange focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col pt-8">
                <label className="flex flex-row w-full gap-2 checkbox bounce">
                  <input type="checkbox" name="remember" className="remember-me" defaultChecked />
                  <svg viewBox="0 0 21 21">
                    <polyline points="5 10.75 8.5 14.25 16 6" />
                  </svg>
                  <p className="text-sm">Remember me</p>
                </label>
              </div>
              <input
                type="submit"
                defaultValue="Log In"
                className="p-2 mt-4 text-lg font-bold text-white transition-all duration-200 rounded-lg cursor-pointer bg-gradient-to-r from-official-yellow to-official-red hover:grayscale"
              />
            </form>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden w-1/2 shadow-2xl lg:flex">
          <img className="hidden object-cover w-full h-screen md:block" src="https://picsum.photos/2000/2000" />
        </div>
      </div>
    </>
  );
}
