import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
	return (
		<section className='flex flex-col bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex flex-col items-center'>
				<img
					src='/images/hero-section-img.png'
					width={500}
					height={500}
					alt='Hero Section Image'
				/>
				<h1 className='text-4xl text-purple mt-10 font-bold'>
					Marketplace for digital products and assets
				</h1>
				<p className='my-5 w-2/4 text-center'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
					mattis malesuada velit, at gravida nisi lacinia sed. Mauris sed
					sagittis metus.
				</p>
				<Link href={'/marketplace'}>
					<button className='px-3 py-2 rounded-3xl text-lg bg-purple text-yellow'>
						Explore
					</button>
				</Link>
			</main>
		</section>
	);
}
