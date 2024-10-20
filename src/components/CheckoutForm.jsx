import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import { customFetch, formatPrice } from "../utils";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/CartSlice";

export const action =
	(store, queryClient) =>
	async ({ request }) => {
		const formData = await request.formData();
		const { name, lastName, phone, address } = Object.fromEntries(formData);
		const user = store.getState().userState.user;
		const { cartItems, orderTotal, numItemsInCart } =
			store.getState().cartState;

		const info = {
			name,
			lastName,
			phone,
			address,
			chargeTotal: orderTotal,
			orderTotal: formatPrice(orderTotal),
			cartItems,
			numItemsInCart,
		};

		try {
			const response = await customFetch.post(
				"/orders",
				{ data: info },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				},
			);
			// remove query
			queryClient.removeQueries(["orders"]);

			//console.log(response);
			store.dispatch(clearCart());
			toast.success("Order Placed Successfully");

			// redirect to orders page
			return redirect("/orders");
			//return response;
		} catch (error) {
			console.log(error);
			const errorMessage =
				error?.response?.data?.error?.message ||
				"there was an error placing your order.";

			toast.error(errorMessage);
			if (error.response.status === 401 || 403) return redirect("/login");

			return null;
		}
	};

const CheckoutForm = () => {
	return (
		<Form
			method='post'
			className='flex flex-col gap-y-4'>
			<h4 className='font-medium text-xl capitalize'>shipping information</h4>
			<FormInput
				type='text'
				label='first Name'
				name='name'
			/>
			<FormInput
				type='text'
				label='Last Name'
				name='lastName'
			/>
			<FormInput
				type='phone'
				label='Phone Number'
				name='phone'
			/>
			<FormInput
				type='text'
				label='address'
				name='address'
			/>
			<div className='mt-4'>
				<SubmitBtn text='place your order' />
			</div>
		</Form>
	);
};
export default CheckoutForm;
