import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	About,
	Landing,
	HomeLayout,
	Error,
	Products,
	Cart,
	Checkout,
	SingleProduct,
	Register,
	Login,
	Orders,
} from "./pages";
import { ErrorElement } from "./components";

// loaders
import { loader as landingLoader } from "./pages/Landing";
import { loader as singleProductLoader } from "./pages/SingleProduct";
import { loader as productsLoader } from "./pages/Products";
import { loader as ordersLoader } from "./pages/Orders";
import { loader as checkoutLoader } from "./pages/Checkout";

// actions
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as checkoutAction } from "./components/CheckoutForm";
import { store } from "./store";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
});

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeLayout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <Landing />,
				errorElement: <ErrorElement />,
				loader: landingLoader(queryClient),
			},
			{ path: "about", element: <About /> },
			{
				path: "products",
				element: <Products />,
				errorElement: <ErrorElement />,
				loader: productsLoader(queryClient),
			},
			{
				path: "products/:id",
				element: <SingleProduct />,
				errorElement: <ErrorElement />,
				loader: singleProductLoader(queryClient),
			},
			{ path: "cart", element: <Cart /> },
			{
				path: "checkout",
				element: <Checkout />,
				loader: checkoutLoader(store),
				action: checkoutAction(store, queryClient),
			},
			{
				path: "orders",
				element: <Orders />,
				loader: ordersLoader(store, queryClient),
			},
		],
	},
	{
		path: "/register",
		element: <Register />,
		errorElement: <Error />,
		action: registerAction,
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <Error />,
		action: loginAction(store),
	},
]);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
export default App;
