import { useLoaderData } from "react-router-dom";
import { formatPrice, customFetch, generateQuantityOptions } from "../utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/CartSlice";

export const loader = async ({ params }) => {
	const response = await customFetch(`/products/${params.id}`);
	return {
		product: response.data.data,
	};
};

const SingleProduct = () => {
	const { product } = useLoaderData();
	const { image, title, price, description, colors, company, quantity } =
		product.attributes;
	const dollarsAmount = formatPrice(price);
	const [productColor, setProductColor] = useState(colors[0]);
	const [productQuantity, setProductQuantity] = useState(1);

	const handleProductQuantity = (e) => {
		setProductQuantity(parseInt(e.target.value));
	};

	const cartProduct = {
		cartID: product.id + productColor,
		productID: product.id,
		image,
		title,
		price,
		quantity,
		productColor,
		company,
	};

	const dispatch = useDispatch();

	const addToCart = () => {
		dispatch(addItem({ product: cartProduct }));
	};

	return (
		<section>
			<div className='text-md breadcrumbs'>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/products'>Products</Link>
					</li>
				</ul>
			</div>
			{/* PRODUCT */}
			<div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
				{/* IMAGE */}
				<img
					src={image}
					alt={title}
					className='w-96 h-96 object-cover rounded-lg lg:w-full'
				/>
				{/* PRODUCT */}
				<div>
					<h1 className='capitalize text-3xl font-bold'>{title}</h1>
					<h4 className='text-xl text-neutral-content font-bold mt-2'>
						{company}
					</h4>
					<p className='mt-3 text-xl'>{dollarsAmount}</p>
					<p className='mt-6 leading-8'>{description}</p>
					{/* COLORS */}
					<div className='mt-6'>
						<h4 className='text-md font-medium tracking-wider capitalize'>
							colors
						</h4>
						<div className='mt-2'>
							{colors.map((color) => {
								return (
									<button
										key={color}
										type='button'
										className={`badge w-6 h-6 mr-2 ${
											color === productColor && "border-2 border-secondary"
										}`}
										style={{ backgroundColor: `${color}` }}
										onClick={() => setProductColor(color)}></button>
								);
							})}
						</div>
					</div>
					{/* QUANTITY */}
					<div className='form-control w-full max-w-xs'>
						<label
							htmlFor='quantity'
							className='label'>
							<h4 className='text-md font-medium tracking-wider capitalize'>
								quantity
							</h4>
						</label>
						<select
							id='quantity'
							className='select select-bordered select-secondary select-md'
							onChange={handleProductQuantity}
							value={productQuantity}>
							{generateQuantityOptions(10)}
						</select>
					</div>
					{/* CART BTN */}
					<div className='mt-10'>
						<button
							className='btn btn-secondary btn-md'
							onClick={addToCart}>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
export default SingleProduct;
